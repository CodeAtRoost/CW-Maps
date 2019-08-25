define( ["qlik", "text!./template.html",'//unpkg.com/leaflet@1.5.1/dist/leaflet.js','text!./leaflet.css'],
	function ( qlik, template,leaflet,css ) {
	$( '<style>' ).html(css).appendTo( 'head' );
		return {
			template: template,
			initialProperties: {
				qHyperCubeDef: {
					qMode:"S",
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 6	,
						qHeight: 1000
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 3,
						max: 3
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 2
					},
					settings:{
						uses: "settings",
						items:{
						/*Scroll:{
						type: "boolean",
						component: "switch",
						label: "Enable Scroll",
						ref: "enableScroll",
						options: [{
							value: true,
							label: "Yes"
						}, {
							value: false,
							label: "No"
						}],
						defaultValue: false					
						},*/
						mapboxKey:{
						ref:"mapBoxKey",
						label: "Mapbox Key",
						type: "string",
						defaultValue:""						
						},
						beginningZoomLevel:{
						ref:"beginZoomLevel",
						label: "Begin Zoom Level",
						type: "string",
						defaultValue:"13",
						expression: "always"						
						},
						beginningCenterLatitude:{
						ref:"beginCenterLatitude",
						label: "Begin Center Latitude",
						type: "string",
						defaultValue:"0",
						expression: "always"						
						},
						beginningCenterLongitude:{
						ref:"beginCenterLongitude",
						label: "Begin Center Longitude",
						type: "string",
						defaultValue:"0",
						expression: "always"						
						},
						maxZoomLevel:{
						ref:"maxZoomLevel",
						label: "Max Zoom Level",
						type: "string",
						defaultValue:"13",
						expression: "always"						
						},
						markerSize:{
						ref:"markerSize",
						label: "Marker Size",
						type: "string",
						defaultValue:"5"					
						},
						markerColor:{
						ref:"markerColor",
						label: "Marker Color",
						type: "string",
						expression: "always",
						defaultValue:"red"						
						}
						}
					
					},
					sorting: {
						uses: "sorting"
					}
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: false
			},
			paint: function () {
						try{
						if (this.$scope.mymap == undefined){
						this.$scope.markersLayer = L.layerGroup();

						var baseLayer= L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + this.$scope.layout.mapBoxKey , {
							attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
							maxZoom:parseInt(this.$scope.layout.maxZoomLevel) ,
							id: 'mapbox.streets'
						});

						
						
						this.$scope.mymap = L.map(
						'mapid',{center: [parseInt(this.$scope.layout.beginCenterLatitude), parseInt(this.$scope.layout.beginCenterLongitude)],
						zoom: parseInt(this.$scope.layout.beginZoomLevel),
						layers: [baseLayer,this.$scope.markersLayer]});
						
						
			
				}
				
				this.$scope.markersLayer.eachLayer(function (layer) {
					layer.remove();
				});
				
						var d = this.$scope.layout.qHyperCube.qDataPages[0].qMatrix;
						for (var i =0; i<d.length;i++)
						{
							var fColor =  this.$scope.layout.markerColor;
							if (d[i].length=5){
								fColor= d[i][4].qText
							}

							//var marker = L.marker([d[i][1].qNum,d[i][2].qNum ]).addTo(mymap);
							//marker.bindPopup(d[i][0].qText + " - " + d[i][3].qText)
							L.circle([d[i][1].qNum,d[i][2].qNum], 2000, {
								color: fColor,
								fillColor:fColor,
								fillOpacity: 0.5
							}).addTo(this.$scope.markersLayer).bindPopup(d[i][0].qText + " - " + d[i][3].qText);


						}
				
				
			
				}
				catch(e){console.log(e)}
				
				return qlik.Promise.resolve();
			},
			controller: ['$scope', function ( $scope ) {
				//add your rendering code here
				
				
			}]
		};

	} );

