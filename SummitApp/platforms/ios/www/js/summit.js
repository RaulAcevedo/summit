define(function(require, exports, module){
	'use strict';
//----------------------------------------------  Famous Modules ------------------------------------------------------------
		var Engine 				= require("famous/core/Engine");
		var Surface 			= require('famous/core/Surface');
		var ImageSurface 		= require('famous/surfaces/ImageSurface');
		var ContentView 		= require('famous/core/View');
		var HeaderFooterLayout 	= require('famous/views/HeaderFooterLayout');
		var SequentialLayout 	= require("famous/views/SequentialLayout");
		var RenderNode 			= require('famous/core/RenderNode');
		var ScrollView 			= require('famous/views/Scrollview');
		var ViewSequence 		= require('famous/core/ViewSequence');
		var EventHandler 		= require('famous/core/EventHandler');
		var StateModifier 		= require('famous/modifiers/StateModifier');
		var Modifier 			= require('famous/core/Modifier');
		var Transform 			= require('famous/core/Transform');
		var Easing 				= require('famous/transitions/Easing');
		var View 				= require('famous/core/View');
		var ContainerSurface 	= require('famous/surfaces/ContainerSurface');
		var EdgeSwapper 		= require('famous/views/EdgeSwapper');
		var Utility 			= require('famous/utilities/Utility');
		var ScrollContainer 	= require('famous/views/ScrollContainer');
		var GridLayout 			= require("famous/views/GridLayout");
		var AutoSurface			= require("AutoSurface");

//---------------------------------------------- Local Variables -------------------------------------------------------------

	//--------------------------------------------------------------- fix
	var mainContext = Engine.createContext(),
		eh = new EventHandler(),
		modifier = new Modifier(),
		t,ids,size;
		
	var jQuery = null, 
		db = null,
		obj,
		producto;

	// Variables Auxiliares

	var	currentMenu = 'home',
		currentObjMenu = null,
		htmlProductos='',
		img,
		noEnfermedad = false,
		enfermedades = [],
		enfermedad,
		resultado,
		imgProductos ='',
		listaCultivo = '',
		listaAgente = '',
		condicion,
		htmlListaEnfermedad = '',
		listaEnfermedades = '',
		userAgent = navigator.userAgent || navigator.vendor || window.opera,
		appHeaderSize = 65,
		mTop = 0,
		productoPorTipo,
		titulosTiposProducto={
			1:"Insecticidas y acaricidas",
			2:"Fungicidas y Bactericidas",
			3:"Fumigantes",
			4:"Biológicos",
			8:"Otros",
			5:"Agrobiologicos",
			6:"Bioestimulantes",
			7:"Acondicionadroes de Suelo"
		},paginaSegmentos;
	//---------------------------------------------------------------------------------------

	function getStorage() {
    	var storageImpl;
    	try { 
    		localStorage.setItem("storage", ""); 
    		localStorage.removeItem("storage");
    		storageImpl = localStorage;
    	}catch (err){ 
    		storageImpl = new LocalStorageAlternative();
		}
		return storageImpl;
	}



	function LocalStorageAlternative() {
		var structureLocalStorage = {};
		this.setItem = function (key, value) {
			structureLocalStorage[key] = value;
		}

		this.getItem = function (key) {
		        if(typeof structureLocalStorage[key] != 'undefined' ) {
		        	return structureLocalStorage[key];
		        }else{
            return null;
            }
        }
        this.removeItem = function (key) {
                structureLocalStorage[key] = undefined;
            }
        }

    var mainStorage = getStorage();    
	

	//---------------------------------------------------------------------------------------	

		// Elementos Visuales (HTML,SVG, etc)
	var icon_menu = '<svg class="icon icon-menu"><use xlink:href="#icon-menu"></use></svg>',
		icon_search = '<svg class="icon icon-search"><use xlink:href="#icon-search"></use></svg>',
		icon_close = '<svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg>',
		icon_left = '<svg class="icon icon-arrow-left2"><use xlink:href="#icon-arrow-left2"></use></svg>',
		icon_caret_right = '<svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>',
		icon_caret_down = '<svg class="icon icon-sort-desc"><use xlink:href="#icon-sort-desc"></use></svg>',
		icon_warning = '<svg class="icon icon-warning"><use xlink:href="#icon-warning"></use></svg>',
		icon_up_arrow = '<svg class="icon icon-up-arrow"><use xlink:href="#icon-up-arrow"></use></svg>',
		div_loading = '<div class="loading"><img src="img/loader.gif"><span class="loadingMessage"></span></div>',

		titulo = '<h2>SummitAgroMéxico</h2>',
		contenidoPrincipal = '<div class="screen-display">\
                				<img src="img/logo-home.png" class="logo"></img>\
				                <div class="enlaces">\
				                    <button class="enlace_producto button-text">PRODUCTOS</button>\
				                    <button class="enlace_enfermedad button-text">ENFERMEDADES Y PLAGAS</button>\
				                    <button class="enlace_manual button-text">MANUAL DE BACTERIAS</button>\
				                </div>\
            					<div class="bottom-banner">\
                  						<img src="img/sintox.png" class="banner-logo"  style="left:25%"></img>\
					                  	<img src="img/campo-limpio.png" class="banner-logo" style="left:50%"></img>\
					                  	<img src="img/proocyt.png" class="banner-logo" style="left:75%" ></img>\
					                </div>\
					             </div>',
		generalidades = '<div class="manual"><div class="generalidades"><ul><li>'+ 
						icon_caret_right +
						'<span>Enfermedades bacterianas en la agricultura</span></li><li>'+
						icon_caret_right +
						'<span>Tamaño de bacterias fitopatógenas</span></li><li>'+
						icon_caret_right +'<span>Síntomas</span></li><li>'+
						icon_caret_right +'<span>El cobre como auxiliar en la prevención</span></li><li>'+
						icon_caret_right +'<span>Modo de acción de bactericidas</span></li><li>'+
						icon_caret_right +'<span>Sugerencia de escala de daño visual</span></li><li>'+
						icon_caret_right +'<span>Laboratorios de diagnóstico</span></li><li>'+
						icon_caret_right +"<span>Recomendaciones para prevenir enfermedades bacterianas</span></li></ul></div></div>",

		generalidad = ['<div class="generalidad"> <h2>Enfermedades bacterianas en la agricultura</h2> <p>Las bacterias fitopatógenas pueden causar graves daños en los cultivos, de ahí la importancia de poder reunir las herramientas adecuadas para su control. Ésto implica considerar varios factores tales como el ciclo de la enfermedad, su historial y presencia en la zona, sensibilidad de la variedad, tipo de suelo, organismos vectores, control químico y momento adecuado de aplicación.</p> <p>No se puede negar que a las bacterias se les ha considerado como aliados increíbles pero a su vez también como enemigos invisibles porque muchas producen graves enfermedades. Pero en conjunto, su función biológica resulta indispensable, pues sin ellas no sería posible un gran número de procesos, como la destrucción de gran parte de los residuos orgánicos procedentes de organismos muertos o la existencia de las reacciones químicas para la industria de los alimentos.</p> <p>Las bacterias en general son de los organismos más pequeños que existen sobre el planeta. Son tan diminutas que solamente con un microscopio somos capaces de verlas. Se les llama organismos unicelulares porque están constituidos por una sola célula. En la comunidad científica se les llama células procariotas, es decir, no poseen núcleo propiamente dicho, como ocurre en las células vegetales y animales y el material genético, que se haya reunido en una sola región celular, no está separado del resto de los componentes celulares por una membrana. Por ello, se consideran como un grupo aislado de los animales y los vegetales.</p> <p>Dentro de las bacterias, existen algunos géneros que son capaces de causar enfermedades en las plantas. Se les llama bacterias fitopatógenas y cuando invaden los cultivos las pérdidas en cosecha pueden ser considerables.</p> <p>En años recientes, la incidencia de enfermedades bacterianas en la agricultura se ha incrementado debido a varios factores, entre ellos:</p> <ul> <li>El cambio climático en muchas regiones del planeta ha favorecido las condiciones ideales para su reproducción.</li> <li>Cepas resistentes a los productos usados tradicionalmente.</li> <li>Adaptabilidad de las bacterias fitopatógenas para establecerse en nuevas variedades de plantas y cultivos.</li> </ul> <p>La diseminación de las bacterias fitopatógenas entre plantas o a otra parte de la misma planta, se lleva a cabo principalmente a través de las salpicaduras de agua, los insectos vectores, diversos animales y el hombre. Aún bacterias que poseen flagelos se desplazan solo a distancias muy cortas. La lluvia, por su efecto de lavado o salpicador, lleva y distribuye bacterias de una planta a otra, de uno de sus órganos a otro y del suelo a las partes inferiores. El agua también lleva y separa bacterias que se encuentran sobre o en el suelo hasta otras áreas donde puede haber plantas hospederas. Los insectos no sólo llevan las bacterias hasta las plantas, sino que las inoculan en ellas al introducirlas en determinadas zonas, donde casi siempre se desarrollan.</p> <p>En algunos casos, las bacterias fitopatógenas persisten también en los insectos y dependen de ellos para sobrevivir y diseminarse. En otros casos, los insectos son importantes, aunque no esenciales, en la diseminación de ciertas bacterias fitopatógenas. Los pájaros, conejos y otros animales que frecuentan o se mueven en las plantas, pueden ser también portadores de las bacterias.</p> <p>El hombre contribuye a la diseminación local de las bacterias cuando manipula plantas o realiza prácticas de cultivo, pero también las lleva a grandes distancias al transportar plantas infectadas u órganos de ellas, hasta otras áreas nuevas o al introducir plantas de otras partes. En los casos en que las bacterias infectan a las semillas de sus plantas hospederas, pueden ser llevadas en o sobre ellas a distancias variables mediante cualquiera de los agentes de dispersión de las semillas.</p> <p>Se requiere de una combinación de varios métodos de control para combatir a una enfermedad bacteriana. Debe evitarse la infestación de los campos o de las cosechas, introduciendo y sembrando semillas o plantas sanas. Son muy importantes las medidas sanitarias que permiten disminuir la cantidad de inoculo en un área de cultivo al trasladar y quemar las plantas o ramas infectadas y al limitar la propagación de las bacterias de planta en planta mediante la desinfección de las herramientas y manos después de haber manipulado plantas enfermas.</p> <p>Debido a su microscópico tamaño pueden penetrar por los estomas de las plantas y también por cualquier herida. Las bacterias tienen mucha facilidad para reproducirse cuando las condiciones son adecuadas, y lo hacen en cortos períodos de tiempo, multiplicándose en grandes cantidades. </p> <p>Una bacteria que se encuentra en un medio en el que se dan las condiciones adecuadas se divide cuando alcanza un tamaño determinado, denominado crítico. Entonces la membrana celular se invagina (se pliega hacia adentro) en el ecuador de la célula, con lo que se forman dos bacterias. Estas comienzan a crecer y el proceso se repite. Si las circunstancias son óptimas, se suceden las divisiones, el algunos casos a un ritmo de una cada quince o veinte minutos. Una población bacteriana presenta un ritmo de crecimiento característico, con diversas fases sucesivas denominadas: de latencia, en la que no se produce crecimiento; de crecimiento exponencial, en la que se forman 2, 4,816, etc., células; estacionaria, en la que el número de bacterias de la población no cambia; y por último la de declive, en la que tiene lugar una disminución numérica. Las dos últimas fases se deben a la muerte de las bacterias por agotamiento de los nutrimentos y a la producción de desechos tóxicos. Sin embargo, cuando las bacterias se encuentran en la fase de máxima reproducción, ésta puede alcanzar grandes proporciones, de modo que cuando se observa un daño por bacterias en los cultivos, es que éstos organismos ya se han multiplicado dentro de los tejidos de la planta, por lo que siempre es mejor prevenir el establecimiento en etapas tempranas de su ciclo de vida.</p> <p>Teniendo la nutrición adecuada, una sola célula bacteriana puede producir en 24 horas varios cientos de miles de individuos y cada uno de esos individuos tendrá la capacidad de crear nuevos brotes de infección si existen las condiciones aceptables para su diseminación, como por ejemplo, salpicaduras y heridas en los tallos u hojas.</p> <p>Cuando las bacterias comienzan a reproducirse dentro de las plantas, los daños son muy severos debido a que parasitan e infectan los sistemas de transporte de nutrientes de los cultivos, causando muchos y diferentes síntomas, que van desde pecas y manchas foliares, hasta marchitamientos y podredumbres vasculares.</p> <p>Una vez que han deteriorado el estado natural de sanidad de la planta, las bacterias fitopafógenas pueden propagarse a nuevos sitios para continuar reproduciéndose. Esta diseminación se realiza a través de poda por herramienta infectada, salpicaduras, roces con material contaminado, a través del viento y también debido a semillas y partes vegetativas infectadas.</p> <p>Cuando habitan en el suelo, las bacterias viven principalmente sobre los órganos vegetales y con frecuencia a nivel epifítico o en su mucílago bacteriano natural, el cual las protege de varios factores adversos. Las bacterias pueden sobrevivir también en las semillas, otros órganos de las plantas, o inclusive en en el tracto digestivo de los insectos o plagas del suelo.</p> <p>Sobre las plantas, las bacterias fitopafógenas pueden sobrevivir epífitamente en yemas, en heridas, en sus exudados o en el interior de varios tejidos u órganos que infectan.</p> <p>Los síntomas más comunes causados por bacterias en los cultivos son: marchitez, manchas foliares, pústulas en frutos, tumores en raíces, pudriciones blandas, cánceres, tizones y agallas entre otros. </p> <p>Es importante conocer el comportamiento de la bacteria, por ejemplo, el modo de penetración a la planta; si ésta sobrevive en el suelo, si se transmite por semilla y condiciones ambientales que la favorecen. Identificar lo anterior como primer paso favorece la prevención de evitar graves daños posteriores. Cabe mencionar que la presencia de alta humedad relativa o una película de agua sobre la superficie de la planta, puede ayudar a la penetración de las bacterias por estomas o por heridas, sobre todo, cuando existe temperatura alta y poca luz.</p> <b>Los principales factores que influyen en el éxito del control de bacterias fitopatógenas pueden ser:</b> <ol type="a"> <li>Identificación del Patógeno y su ciclo de vida.</li> <li>Manejo cultural.</li> <li>Momento oportuno de la aplicación preventiva de productos bactericidas y dosis adecuada.</li> <li>Método y equipo de aplicación (cantidad de agua, tipo de boquilla, hora de aplicación, condiciones climáticas, etc).</li> </ol> <p>Existen ocasiones en que las enfermedades bacterianas pueden presentarse en el cultivo como una consecuencia directa de una infección o colonización anterior de un hongo fitopatógeno, ya que los daños causados por el desarrollo de micelios fungosos en las hojas o tallos favorecen la entrada de bacterias, dado que éstos últimos organismos dependen fundamentalmente de heridas y de entradas naturales para poder penetrar a la planta.</p> <p>La presencia de patógenos bacterianos y fungosos aunada a la presencia de plagas, puede desencadenar una serie de síntomas que a primera instancia resulta complicado de identificar a nivel visual, de ahí la necesidad de contar con el apoyo de los laboratorios de análisis fitopatológicos para que se determine que microorganismos se encuentran presentes y poder realizar una toma de decisiones más acertada a la hora de combatir la enfermedad.</p> <p>Algunos complejos o asociaciones entre organismos bacterianos y fungosos que se pueden encontrar en los cultivos de hortalizas y frutales son los siguientes:</p> <p><i>Alternaría sp. + Xanthomonas sp., Colletotrichum sp. + Pseudomonas sp., Mycosphaerella sp. + Xanthomonas sp., Septoria sp. + Xanthomonas sp., Stemphyllium sp. + Pseudomonas sp, Fusarium sp. + Pectobacterium sp., Phytophthora sp. + Pectobacterium sp., Sarocladium sp. + Pseudomonas sp., Pyricularia sp. + Xanthomonas sp., etc.</i></p> <p>Referencia:<br>Agrios G.N. 1998. Fitopatología, 3era Edición, México, 838 p. </p> </div>','<div class="generalidad"> <h2>Tamaño de Bacterias Fitopatógenas </h2> <ul> <li> Entre las ventajas de las bacterias fitopatógenas son su reproducción exponencial, su gran diseminación en condiciones de humedad y su microscópico tamaño. Para poder visualizar a estos organismos es necesaria la ayuda de un microscopio ya que a simple vista resultan invisibles. </li> </ul> <div class="imgBacterias"> <img src="img/generalidades/1.jpg" alt=""> <span>Grano de Polen de Manzano: 45-50 micras</span> <img src="img/generalidades/2.jpg" alt=""> <span>Esporas de Hongo Alternaria: 48 micras</span> <img src="img/generalidades/3.jpg" alt=""> <span>Estoma de Chile Jalapeño: 20 micras<br>Apertura estomática: 1.33 micras</span> <img src="img/generalidades/4.jpg" alt=""> <span>Bacterias: 1.2 a 3 micras</span> <img src="img/generalidades/5.jpg" alt=""> <span>Esporas de Hongo Fusarium: 6 micras</span> </div> </div>','<div class="generalidad mapa"> <h2>Síntomas </h2> <h3> Bacterias Fitopatógenas </h3> <ul> <li> <h5>Síntomas Foliares (Manchas, pústulas, lesiones en follaje y tallo)</h5> <ul> <li>Pseudomonas syringae</li> <li>Xanthomonas vesicatoria</li> <li>Streptomyces scabies</li> </ul> </li> <li> <h5>Síntomas Vasculares (Pudriciones, marchitez, colapsos)</h5> <ul> <li>Erwinia amylovora</li> <li>Pectobacterium carotovorum</li> <li>Acidovorax avenae</li> <li>Pseudomonas corrugata</li> <li>Ralstonia solanacearum</li> <li>Clavibacter michiganensis</li> <li>Agrobacterium tumefasciens</li> <li>Xyllela fastidiosa</li> </ul> </li> </ul> <div class="imagenAgente"> <div> <div>Xanthomonas campestris en <b>Hoja de Tomate</b></div> <span>Manchas foliares</span> <div> <img src="img/generalidades/6.jpg" alt=""> </div> </div> <div> <div>Xanthomonas campestris en <b>fruto de Tomate</b></div> <span>Manchas en frutos</span> <div> <img src="img/generalidades/7.jpg" alt=""> </div> </div> <div> <div>Pseudomonas gladioli en <b>Cebolla</b></div> <span>Manchas Pudrición interna</span> <div> <img src="img/generalidades/8.jpg" alt=""> </div> </div> <div> <div>Pectobacterium carotovorum en <b>Piña</b></div> <span>Colapso y marchitez</span> <div> <img src="img/generalidades/9.jpg" alt=""> </div> </div> <div> <div>Acidovorax avenae en <b>Melón</b></div> <span>Daño vascular y exudados</span> <div> <img src="img/generalidades/10.jpg" alt=""> </div> </div> </div> </div>','<div class="generalidad"> <h2>El Cobre como auxiliar en la Prevención </h2> <p> A los cobres se les considera de los primeros materiales utilizados para combatir organismos patógenos en las plantas y se ha utilizado desde principios de 1800. El Caldo Bordelés fué pilar para que dentro de la agricultura se empezara a estudiar y recomendar ampliamente este material, debido a sus propiedades biocidas en las concentraciones adecuadas. Los compuestos más usados de esta categoría son : Octanoato de Cobre, Sulfato de Cobre Pentahidratado, Hidróxido de Cobre, Oxicloruro de Cobre, Sulfato Tribasico de Cobre y Oxido Cúprico entre otros. </p> <p> El cobre como fungicida/bactericida funciona como protectante y puede ser utilizado en programas de rotación de productos específicos, así como también en aplicaciones previas a este tipo de componentes con la finalidad de disminuir la cantidad de inóculo inicial o si se aplica preventivamente, evita que esporas de hongos puedan germinar y afecta el desarrollo de las poblaciones bacterianas. </p> <p> Los cobres son un excelente auxiliar en el manejo de las enfermedades, y en el mercado de agroquímicos existen formulaciones en gránulos dispersables, suspensiones, polvos humectables y gránulos dispersables. </p> <p> Es conveniente que todos los productos a base de cobre se apliquen en base a las recomendaciones de etiqueta. </p> <div class="micro"> <span>Formulaciones de productos Bactericidas/Fungicidas a base de Cobre vistos al microscopio (10x)</span> <img src="img/generalidades/11.jpg" alt=""> <span>Sulfato de Cobre Pentahidratado (Cristales Solubles)</span> <img src="img/generalidades/12.jpg" alt=""> <span>Oxicloruro de Cobre (Polvo Humectable)</span> <img src="img/generalidades/13.jpg" alt=""> <span>Octanoato de Cobre (Líquido emulsionable)</span> <img src="img/generalidades/14.jpg" alt=""> <span>Hidróxido Cúprico (Formulación DF)</span> </div> <div class="luz"> <div><span>Luz Directa</span></div> <div> <img src="img/generalidades/15.jpg" alt=""><img src="img/generalidades/16.jpg" alt=""> <span>Fitotoxicidad causada por exceso de Sulfato de Cobre Pentahidratado en la hoja de Tomate.</span> <img src="img/generalidades/17.jpg" alt=""><img src="img/generalidades/18.jpg" alt=""> <span>Ausencia de Fitotoxicidad al utilizar Oxicloruro de Cobre a dosis recomendadas.</span> </div> <div><span>Luz Invertida</span></div> </div> </div>','<div class="generalidad accionBactericida"> <h2>Modo de Acción de Bactericidas </h2> <img src="img/generalidades/22.jpg" alt=""> <h4>Efectos de Bactericidas:</h4> <ul> <li> Octanoato de Cobre: <ul> <li>Daño irreversible en pared celular</li> <li>La célula bacteriana se degrada por lisis</li> <li>Bactericida</li> </ul> </li> <li> Gentamicina: <ul> <li>Unión irreversible al ribosoma 30s</li> <li>Bloqueo de síntesis de proteínas</li> <li>Evita la formación de enzimas</li> <li>Generación de proteínas anómalas no funcionales</li> <li>Impide el desarrollo y multiplicación de la célula bacteriana</li> <li>Bactericida</li> </ul> </li> <li> Oxitetraciclina: <ul> <li>Unión irreversible al ribosoma 30s</li> <li>Bloqueo de síntesis de proteínas</li> <li>Altera membrana citoplasmática</li> <li>Efecto en fosforilación oxidativa</li> <li>Bacteriostático</li> </ul> </li> </ul> </div>','<div class="generalidad sugerencia"> <h2>Sugerencia de Escala de Daño Visual </h2> <div> <span>Niveles de Enfermedad</span> <img src="img/generalidades/23.jpg" alt=""> </div> <div> <ol type="1"> <li>Planta Sana o Asintomática.</li> <li>Daño inicial visible.</li> <li>Daño avanzando velozmente.</li> <b>Máxima Etapa de Control.</b> <li>Planta Irrecuperable.</li> <li>Planta Muerta.</li> </ol> </div> <p><b>Ejemplo:</b> Evolución del Daño por Mancha Bacteriana en el Cultivo de Chile</p> <img src="img/generalidades/24.jpg" alt=""> </div>','<div class="generalidad laboratorio"> <h2>Laboratorios de Diagnóstico </h2> <p>La importancia de los laboratorios de diagnóstico fitosanitario radica en que los resultados proporcionados permiten que la toma de decisiones sea más certera para controlar la enfermedad. Es conveniente contar con un programa para envío de muestras desde inicio para tener conocimiento de los patógenos presentes en semilla y cultivo ya establecido. Los datos recabados serán de gran utilidad para el manejo posterior de la enfermedad o en caso de que reincida en un futuro.</p> <img src="img/generalidades/25.jpg" alt=""> <img src="img/generalidades/26.jpg" alt=""> <img src="img/generalidades/27.jpg" alt=""><br><br> <img src="img/generalidades/28.jpg" alt=""> <img src="img/generalidades/29.jpg" alt=""> <h3>Envío de Muestras al Laboratorio</h3> <p>Los procedimientos siguientes minimizan el deterioro durante el transporte y acelera el diagnóstico:</p> <ol type="1"> <li>Proporcione la información completa solicitada (Cultivo, región, síntomas observados, eventos climáticos, etc)</li> <li>Coloque las muestras en bolsas de plástico en el momento de la colección, no horas o días después. No selle las bolsas de plástico. No coloque servilletas de papel mojadas. No moje plantas porque el exceso de agua causa una descomposición rápida. Las plantas mojadas por el rocío, lluvia o irrigación deberían secarse previo al envío. No llene de mas las bolsas de plástico con las plantas porque el tejido de las plantas se dañará con su propio calor e insuficiencia de ventilación.</li> <li> Envié las muestras inmediatamente después de la recolección. Si la muestra no puede ser enviada inmediatamente, refrigérela hasta que sea enviada. Las plantas muertas o material que esta seco o descompuesto, dificulta su diagnóstico a su llegada.</li> </ol> </div>','<div class="generalidad generalidades"> <h2>Recomendaciones </h2> <ul> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Utilizar semilla libre de infección.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Utilizar variedades y/o materiales tolerantes.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Promover la nutrición balanceada (evitar exceso de nitrógeno).</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Eliminar residuos de cosecha.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Control de insectos vectores.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Control de malezas hospederas.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Utilizar bactericidas.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Establecer programa de aplicaciones preventivas.</li> <li><svg class="icon icon-caret-right"><use xlink:href="#icon-caret-right"></use></svg>Rotación de productos bactericidas.</li> </ul> </div>'],
		nosotros = '<div class="nosotros"><h2>Nuestra misión</h2><p>Contribuir a la producción alimentaria en Mexico, proporcionando soluciones efectivas, con un equipo responsable y profesional que hace realidad los sueños de nuestros clientes , empleados y accionistas</p><h2>Nuestra visión</h2><ul><li>Ser una organización solida y valiosa en la cadena de producción de alimentos.</li><li>Ser reconocidos como una organización que fomenta la integración el respeto, la colaboración y el desarrollo de sus empleados.</li><li>Ser una organización con responsabilidad social y que toma acciones al respecto.</li><li>Ser una organización dinámica con adaptación al cambio que afronta los retos de forma creativa.</li></ul><h2>Valores</h2><ul><li>Integridad y dirección solida</li> <li>Pasión y Compromiso</li> <li>Congruencia</li> <li>Profesionalismo</li> <li>Liderazgo</li> <li>Respeto y colaboración.</li></ul><h2>Summit Agro en México</h2><p>Nuestro equipo comercial y de soporte tecnico se encuentra ubicado en las principales regiones agrícolas del país, por lo que puede contar con ellos para asesoría técnica en su campo.</p><img src="img/regiones-agriculas-mexico.png" />',
		contacto = '<div class="contacto"><h2>Contacto</h2><h3><svg class="icon icon-office"><use xlink:href="#icon-office"></use></svg>&nbsp;&nbsp;&nbsp;Dirección &nbsp;&nbsp;&nbsp;<small><a href="geo:19.447007,-99.220877?q=Ruben+Dario+No.+281,+Col.+Bosque+de+Chapultepec">(Abrir mapa)</a></small></h3>Edificio Torre Chapultepec Calle de Ruben Dario No. 281, Piso 19-1902 <br>Col. Bosque de Chapultepec, CP 11580 <br>Delegación Miguel Hidalgo, México, DF. <br><br><b>Tel:</b> +52 (55) 5279-4340<br><a href="http://www.summitagromexico.com.mx" target="_blank">www.summitagromexico.com.mx</a>';

	var calculateContentHeight = function(element){
							    	var totalHeight = 0;
									jQuery(element).children().each(function(){
										if(jQuery(this).is(':visible')) {
										    totalHeight = totalHeight + jQuery(this).outerHeight(true);
										}   
									});
									return totalHeight;
							    };

	var detailScreenCreator = (function(contentClass){

							var view,modifier,screen,page;

							var layout = new HeaderFooterLayout({
								headerSize: appHeaderSize,
								footerSize: 0
							});

							//--------------------------------------------------------------------------ENCABEZADO DE LA APLICACION
							var headerLayout = new HeaderFooterLayout({direction: 0}),
							headerIcon = new Surface({
								size: [true,true],
								content: '<button class="button-invisible button-back">'+icon_left+'</button',
							}),
							headerContent = new Surface({
								size: [undefined,undefined],
								content: '',
							});
							
							// Add Header Icon
							view = new View();
						    modifier = new Modifier({
						      origin: [0, 0.5],
						      align: [0, 0.5]
						    });
						    view.add(modifier).add(headerIcon);
						    headerLayout.header.add(view);
                            
						    // Add Header Title Content
						    view = new View();
						    modifier = new Modifier({
						      origin: [0.5, 0.5],
						      align: [0.5, 0.5]
						    });

						    view.add(modifier).add(headerContent);
						    headerLayout.content.add(view);
							
							var container = new ContainerSurface({
									size:[undefined,undefined],
									classes:['app_header'],
									properties:{
										backgroundColor: '#3B8D25',
										color: '#EEE',
										fontFamily: 'Trebuchet MS'
									}
								});
							
							// Construir todo el layout del header de la pagina 
							container.add(headerLayout);
							layout.header.add(container);
							//-------------------------------------------------------------------------- CONTENIDO

							view = new View();
						    page = {};
						    page.modifier = new Modifier({
						      origin: [0, 0],
						      align: [0, 0]
						    });
						    
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
						    page.surface.addClass(contentClass);
						    page.surface.scroller = page.content;
						    page.surface.notifyHeightChange = function(nH){

						    	if(this.scroller.scrollview.getPosition() + this.scroller.getSize()[1] > nH){
						    		this.scroller.scrollview.setPosition(Math.max(nH-this.scroller.getSize()[1],0));
						    	}
						 
						    }
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
							view.add(page.modifier).add(page.content);
							layout.content.add(view);

							//-------------------------------------------------------------------------- Creacion de ventana
							screen = new ContainerSurface({
								size:[undefined,undefined],
								classes:["detail_screen"],
								properties:{
									backgroundColor: '#FFFFFF'
								}
							});

							//referencia final a toda la pantalla
							screen.add(layout);

							var cargarContenido = function(contenido){
								page.content.scrollview.setPosition(0);
								page.surface.setContent(contenido);
							};

							var refreshScroll = function(){
								page.content.scrollview.setPosition(0);
								page.surface()

							};

							return{
								headerIcon: headerIcon,
								headerContent: headerContent,
								screen: screen,
								cargarContenido: cargarContenido,
								header:headerLayout,
								refreshScroll:refreshScroll
							};
						});


		//Componentes Famous
		//Pantalla de Carga;
		var loadingScreen = (function(){
								var screenId  =  "loading_screen";

								return{
									modifier:new StateModifier({
													origin: [0, 0]
												}),
									screen: new Surface({
													size: [undefined, undefined],
													content: div_loading,
													classes:[screenId],
													properties:{
														background: '#FFF',
														'margin-top': mTop + 'px'
													}
												})
									}
							})(),

			//Pantalla de Busqueda
			searchScreen = (function(){

							var view,modifier,surface,container,rc,screen,page,array,pages={};
							var layout = new HeaderFooterLayout({
								headerSize: appHeaderSize,
								footerSize: 0
							});
							var headerLayout = new HeaderFooterLayout({direction: 0}),
							headerIcon = new Surface({
								size: [true,true],
								content: '<button class="button-invisible button-close">'+icon_close+'</button>'
							}),
							headerContent = new Surface({
								size: [undefined,undefined],
								content: '<div class="buscar"><input id="searchField" type="text" placeholder="Buscar..." data-word=""></div>'
							});

							// Add Header Icon
							view = new View();
						    modifier = new Modifier({
						      origin: [0, 0.5],
						      align: [0, 0.5]
						    });
						    view.add(modifier).add(headerIcon);
						    headerLayout.header.add(view);
                            
						    // Add Header Title Content
						    view = new View();
						    modifier = new Modifier({
						      origin: [0.5, 0.5],
						      align: [0.5, 0.5]
						    });

						    view.add(modifier).add(headerContent);
						    headerLayout.content.add(view);

							container = new ContainerSurface({
									size:[undefined,undefined],
									classes:['app_header'],
									properties:{
										backgroundColor: '#3B8D25',
										color: '#EEE',
									}
								});

							container.add(headerLayout);
							layout.header.add(container);

							//-------------------------------------------------------------------------- CONTENIDO

							view = new View();
						    page = {};
						    page.modifier = new Modifier({
						      origin: [0, 0],
						      align: [0, 0]
						    });
						    
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
							view.add(page.modifier).add(page.content);
							layout.content.add(view);

							//-------------------------------------------------------------------------- Creacion de ventana
							screen = new ContainerSurface({
								size:[undefined,undefined],
								classes:["detail_screen"],
								properties:{
									backgroundColor: '#FFFFFF'
								}
							});

							//referencia final a toda la pantalla
							screen.add(layout);
							var cargarContenido = function(contenido){
								page.content.scrollview.setPosition(0);
								page.surface.setContent(contenido);
							};

							var refreshScroll = function(){
								page.content.scrollview.setPosition(0);
							};

							return{
								headerIcon: headerIcon,
								headerContent: headerContent,
								screen: screen,
								cargarContenido: cargarContenido,
								refreshScroll:refreshScroll
							};


							})(),

			//Pantalla Principal de la aplicacion
			appScreen = (function(){
							var view,modifier,surface,container,rc,screen,page,array,pages={};
							var layout = new HeaderFooterLayout({
								headerSize: appHeaderSize,
								footerSize: 0
							});

							//--------------------------------------------------------------------------ENCABEZADO DE LA APLICACION
							var headerLayout = new HeaderFooterLayout({direction: 0}),
							headerIcon = new Surface({
								size: [true,true],
								content: '<button id="button-menu" class="button-invisible">'+icon_menu+'</button>'
							}),
							headerContent = new Surface({
								size: [undefined,undefined],
								content: titulo
							});
							
							//------------------------------------------------------------------ ICONO DE MENU
							view = new View();
						    modifier = new Modifier({
						      origin: [0, 0.5],
						      align: [0, 0.5]
						    });
						    view.add(modifier).add(headerIcon);
						    headerLayout.header.add(view);
                            
						   
						    //------------------------------------------------------------------- TITULO DE SECCION
						    view = new View();
						    modifier = new Modifier({
						      origin: [0.5, 0.5],
						      align: [0.5, 0.5]
						    });
						    view.add(modifier).add(headerContent);
						    headerLayout.content.add(view);

						    //------------------------------------------------------------------- ICONO DE BUSQUEDA
						    view  = new View();
						    modifier = new Modifier({
						      origin: [0.5, 0.5],
						      align: [0.5, 0.5]
						    });

						    headerIcon = new Surface({
						    	size: [true,true],
						    	content: '<button id="button-search" class="button-invisible">'+icon_search+'</button>'
						    });

						    view.add(modifier).add(headerIcon);
						    headerLayout.footer.add(view);

						    	
						    // Colocar Header en  pantalla principal
							container = new ContainerSurface({
									size:[undefined,undefined],
									classes:['app_header'],
									properties:{
										backgroundColor: '#3B8D25',
										color: '#EEE',
									}
								});

							container.add(headerLayout);
							layout.header.add(container);

						    //------------------------------------------------------------------------ CONTENIDO DE LA APLICACION

						    rc = new EdgeSwapper({
						       overlap: false,
						       outTransition: false,
						       size:[undefined, undefined]
						       });

						    layout.content.add(rc);

						    // ------------------------------------------------------------------------ PAGINAS

						    // --------------------------------------------------------------------- Pagina Principal
						    
						    page = {};
						    page.modifier = new StateModifier({
						      origin: [0, 0],
						      align: [0, 0]
						    });

						    // Contenido de la Aplicacion
						    page.content = new Surface({
										    size: [undefined, undefined],
										    classes: ['home-background'],
										    content: contenidoPrincipal
										});

						    view = new View();
						    view.add(page.modifier).add(page.content);
						    page.content = view;
						    page.surface = view;						  
						    pages['inicio'] = page;

						    // ------------------------------------------------------------------- Pagina Nosotros 
						   					    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.setContent(nosotros);
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['nosotros'] = page;

						     // ------------------------------------------------------------------- Pagina Contacto
						    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.setContent(contacto);
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['contacto'] = page;

						    // ------------------------------------------------------------------- Pagina Productos
						    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['productos'] = page;

						    // ------------------------------------------------------------------- Pagina Segmentos
						    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	classes:['segmentosPage'],
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
						    page.surface.scroller = page.content;
						    page.surface.notifyHeightChange = function(nH){

						    	if(this.scroller.scrollview.getPosition() + this.scroller.getSize()[1] > nH){
						    		this.scroller.scrollview.setPosition(Math.max(nH-this.scroller.getSize()[1],0));
						    	}
						 
						    }
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['segmentos'] = page;

						    // ------------------------------------------------------------------- Pagina Enfermedades
						    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['enfermedades'] = page;

						     // ------------------------------------------------------------------- Pagina Manual
						    
						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['manual'] = page;

						    // ------------------------------------------------------------------- Pagina Buscador

						    page = {};
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['buscador'] = page;

						    // ------------------------------------------------------------------- Pagina Resultado Busquedapage = {};
						    page.content = new Surface();
						    page.content = new ScrollContainer({
										    	scrollview: {direction: Utility.Direction.Y}
										    });

						    page.surfaceArray = [];
						    page.content.sequenceFrom(page.surfaceArray);
						    page.surface = new AutoSurface({
						    	size:[undefined,true]
						    });
						    page.surface.calculateHeight = calculateContentHeight;
							page.surface.pipe(page.content);
							page.surfaceArray.push(page.surface);
						    pages['resultadoBusqueda'] = page;

							//-------------------------------------------------------------------- CREACION DE LA PANTALLA

							screen = new ContainerSurface({
								size:[undefined,undefined],
								classes:['main_app'],
								properties:{
									backgroundColor: '#FFFFFF'
								}
							});

							screen.add(layout);

							var cargarContenido = function(contenido,options){
								StatusBar.hide();
								rc.setOptions(options);
								rc.show(pages[contenido].content);
								return pages[contenido].surface;
							};

							var refreshScroll = function(){
								for(var p in pages){
									if(pages[p].content.scrollview){
										pages[p].content.scrollview.setPosition(0);
									}
								}

							};

							return{
								headerIcon: headerIcon,
								headerContent: headerContent,
								screen: screen,
								cargarContenido: cargarContenido,
								refreshScroll:refreshScroll
							};
						})(),
			
			//Pantalla de Detalle de Producto
			detailScreen = detailScreenCreator('detailScroll'),
			enfermedadDetailScreen = detailScreenCreator('enfermedad'),
			productoDetailScreen = detailScreenCreator('producto');



		var sfMenu = new Surface({
			  size: [true, undefined],
			  align: [0, 0],
			  origin: [0, 0],
			  content: '<div class="menu"><div class="menuTop"></div><ul>\
			  	<li><button id="inicio" class="button-invisible menuActivo"><svg class="icon icon-home"><use xlink:href="#icon-home"></use></svg><span>Inicio</span></button></button></li>\
			  	<li><button id="productos" class="button-invisible"><svg class="icon icon-th-list"><use xlink:href="#icon-th-list"></use></svg><span>Productos</span></button></li>\
			  	<li><button id="segmentos" class="button-invisible"><svg class="icon icon-segmentos"><use xlink:href="#icon-segmentos"></use></svg><span>Segmentos</span></button></li>\
				<li><button id="enfermedades" class="button-invisible"><svg class="icon icon-aid-kit"><use xlink:href="#icon-aid-kit"></use></svg><span>Enfermedades y plagas</span></button></li>\
				<li><button id="advanced_search" class="button-invisible"><svg class="icon icon-aid-kit"><use xlink:href="#icon-search"></use><span>Búsqueda avanzada</span></button></li>\
				<li><button id="manualBacterias"class="button-invisible"><svg class="icon icon-book"><use xlink:href="#icon-book"></use></svg><span>Manual de Bacterias</span></button></li>\
				<li><button id="nosotros" class="button-invisible"><svg class="icon icon-users"><use xlink:href="#icon-users"></use></svg><span>Nosotros</span></button></li>\
				<li><button id="contacto" class="button-invisible"><svg class="icon icon-contact_phone"><use xlink:href="#icon-contact_phone"></use></svg><span>Contacto</span></button></li>\
				</ul><div class="menuTop" class="button-invisible"></div></div>',
			  properties: {
			    color: 'white',
			    textAlign: 'center',
			    'background-color': 'rgba(0,0,0,0)'
			  }
			});
		
	//Auxiliares para UI
		var xMenu = null,
			xObjetivo = null,
			mostrarMenu = false,
			xProducto = null,
			yProducto = null;



//---------------------------------------------- Public  Functions -----------------------------------------------------------
		var summitScreens,imageZoomView,statusBarSurface,overlaySurface,menuModifier;
		var initialize =function($){
			jQuery = $;
			db = null;

			window.enfermedades  = enfermedades;
			document.addEventListener('deviceready', prepareApplication, false);
			summitScreens = new EdgeSwapper({
						       overlap: false,
						       inTransition: true,
						       outTransition: true,
						       size:[undefined, undefined]
						       });


			var stateModifier = new StateModifier({
			  transform: Transform.translate(0, 0, 0)
			}), webViewModifier = new StateModifier({
				transform: Transform.translate(0,0,30)
			}), statusbarModifier = new StateModifier({
				transform: Transform.translate(0,0,5)
			}), overlayModifier = new StateModifier({
				transform: Transform.translate(0,0,15)
			});

			menuModifier = new StateModifier({
				transform: Transform.translate(0,0,20)
			});


			statusBarSurface = new Surface({
				size: [undefined,15],
				properties:{
					backgroundColor: '#1B6D05'
				}
			});

			overlaySurface = new Surface({
				size:[undefined,undefined],
				classes:['menuoverlay'],
				properties:{
					background: "rgba(0,0,0,.5)"
				}
			});

			var upIcon = new Surface({
								size: [true,true],
								content: '<button class="button-invisible button-up">'+icon_up_arrow+'</button>'
							}),
				upView = new View(),
				upModifier = new Modifier({
						      origin: [0, 0.5],
						      align: [0, 0.5]
						    });
			
			upView.add(upModifier).add(upIcon);
			productoDetailScreen.header.footer.add(upView);

			mainContext.add(overlayModifier).add(overlaySurface);
			mainContext.add(statusbarModifier).add(statusBarSurface);
			mainContext.add(stateModifier).add(summitScreens);
			//mainContext.add(webViewModifier).add(imageZoomView);
			mainContext.add(menuModifier).add(sfMenu);

			menuModifier.setOrigin([1,0]);			
			jQuery('.menuoverlay').hide();
			summitScreens.show(loadingScreen.screen);



			eh.on('llenarProducto', function() {
				summitScreens.setOptions({
	                inTransition: true,
	                outTransition: true
	            });
				summitScreens.show(productoDetailScreen.screen);
				var descripcion = '<img class="detail_image" src="img'+producto['imagen']+'" /><div class="tap_button" data="product_detail_descripcion"><span>Descripción</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div><div class="tap_description" id="product_detail_descripcion">'+producto['descripcion']+'</div>';
				descripcion += '<div class="tap_button" data="product_detail_instrucciones" ><span>Instrucciones de uso</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
				descripcion += '<div class="tap_description"  id="product_detail_instrucciones">'+producto['instrucciones']+'</div>';

				descripcion += '<div class="tap_button" data="product_detail_precauciones"><span>Precauciones y advetencias de uso</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
				descripcion += '<div class="tap_description"  id="product_detail_precauciones">'+producto['precauciones']+'</div>';

				descripcion += '<div class="tap_button" data="product_detail_auxilios"><span>Primeros auxilios y recomendaciones </span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
				descripcion += '<div class="tap_description"  id="product_detail_auxilios">'+producto['auxilios']+'</div>';

				descripcion += '<div class="tap_button" data="product_detail_medioAmbiente"><span>Medidas de precaución al medio ambiente</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
				descripcion += '<div class="tap_description" id="product_detail_medioAmbiente">'+producto['medioAmbiente']+'</div>';
				
				productoDetailScreen.cargarContenido(descripcion);
				productoDetailScreen.headerContent.setContent("<h2>"+producto['nombre']+"</h2>");
			});


			eh.on('llenarEnfermedad', function(){
				
					var tituloEnfermedad = "";
					var descripcion = "";
					if ( noEnfermedad ){
						descripcion = '';
						if ( currentMenu == 'enfermedad_producto'){
							descripcion += '<div class="clear"></div><div class="title-seccion">Productos</div>';
							descripcion += htmlProductos;
						}
						descripcion += '';
						tituloEnfermedad = "<h2>Listado enfermedades</h2>";
					}	else   {
						var descripcion = ''+
															'<h2>'+ enfermedad.cultivo + ' - '+ enfermedad.nombre +'</h2>'+
															'<div class="agente"><h4>'+ enfermedad.agente +'</h4></div>';

						
						if ( enfermedad.imagenes !=null ) {
							if(enfermedad.imagenes.length >0 ){		
								descripcion += '<div class="tap_button" data="enfermedad_detail_imagenes" ><span>Imágenes</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
								descripcion += '<div id="enfermedad_detail_imagenes" class="tap_description">';

								for (var i = 0; i < enfermedad.imagenes.length; i++) {
									var desc = (enfermedad.imagenes[i].descripcion == null ? '': enfermedad.imagenes[i].descripcion);
									img = '<a class="image_zoom" data="img'+ enfermedad.imagenes[i].imagen +'"><img src="img'+ enfermedad.imagenes[i].imagen +'"></img></a>';
									descripcion += '<div>'+  desc +'</div>';
									descripcion += img;
								}
								descripcion += '</div>';
							}
						}
						
						descripcion += '<div class="tap_button" data="enfermedad_detail_descripcion"><span>Descripción</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';

						if ( enfermedad.descripcion ) {
								if (enfermedad.descripcion.length > 10 && !empty(enfermedad.descripcion) ){
									descripcion += '<div id="enfermedad_detail_descripcion" class="tap_description">'+ enfermedad.descripcion +'</div>';
								}
						}

						if (enfermedad.recomendaciones){
							if (enfermedad.recomendaciones.length > 10 && !empty(enfermedad.recomendaciones) ){
								descripcion += '<div class="tap_button" data="enfermedad_detail_recomendaciones" ><span>Recomendaciones</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
								descripcion += '<div id="enfermedad_detail_recomendaciones" class="tap_description">'+ enfermedad.recomendaciones +'</div>';
							}
						}

						if (enfermedad.preventivo){
								if (enfermedad.preventivo.length > 10 && !empty(enfermedad.preventivo)){
								descripcion += '<div  class="tap_button" data="enfermedad_detail_preventivo"><span>Tratamiento Preventivo</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
								descripcion += '<div id="enfermedad_detail_preventivo" class="tap_description">'+ enfermedad.preventivo +'</div>';
							}
						}

						if (enfermedad.curativo){
								if (enfermedad.curativo.length > 10 && !empty(enfermedad.curativo)){
									descripcion += '<div class="tap_button" data="enfermedad_detail_curativo" ><span>Tratamiento Curativo</span><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
									descripcion += '<div id="enfermedad_detail_curativo" class="tap_description" >'+ enfermedad.curativo +'</div>';
								}
						}

						if ( currentMenu == 'enfermedad_producto'){
									descripcion += '<div class="clear"></div><div class="title-seccion">Productos</div>';
									descripcion += htmlProductos;
						}
						descripcion += '';
			            tituloEnfermedad = "<h2>Enfermedades cultivo</h2>";
					}
					summitScreens.setOptions({
						overlap:false,
		                inTransition: true,
		                outTransition: true
		            });
					summitScreens.show(enfermedadDetailScreen.screen);
					enfermedadDetailScreen.cargarContenido(descripcion);
					enfermedadDetailScreen.headerContent.setContent(tituloEnfermedad);
			});
		};

// ------------------------------------------------ Inner Functions ---------------------------------------------------------

		// Application Start Point
		function prepareApplication(){
			StatusBar.overlaysWebView(true);
			if (cordova.platformId == 'android') {	
			    StatusBar.backgroundColorByHexString("#3B8D25");
			    AndroidFullScreen.immersiveMode();
			}	

			openDB();
		}

		//Funcion que espera a mostrar un producto
		function ocultarProducto(){
			currentMenu = 'home';
			summitScreens.setOptions({
				overlap:false,
                inTransition: true,
                outTransition: true
            });

			summitScreens.show(appScreen.screen);
		}

		//Buscar Enfermedades por Id
		function buscarEnfermedad(id){
			enfermedad = new Object;
			db.transaction(function (tx){
				tx.executeSql('SELECT * from imagen_enfermedad WHERE enfermedad_id=?', [id], function (tx, results){
					var len = results.rows.length;
					console.log("Enfermedad ID (iMAGES): ", id);
					if(len>0)
					{
						enfermedad['imagenes'] = [];
						for (var i = 0; i < len; i++) {
							enfermedad['imagenes'][i] = [];
							enfermedad['imagenes'][i]['imagen'] = results.rows.item(i)['imagen'];
							enfermedad['imagenes'][i]['descripcion'] = results.rows.item(i)['descripcion'];
						}
						enfermedad['imgload'] = true;
					}else{
						console.log("No hay imagenes");
					}
				}, null);
			});

			db.transaction(function (tx){
				tx.executeSql('SELECT E.*, C.nombre as cultivo FROM enfermedad E INNER JOIN propiedad C ON E.cultivo_id=C.id WHERE E.id=?', [id], function (tx, results){
					var len = results.rows.length;

					if(len>0){
						enfermedad['nombre'] = results.rows.item(0)['nombre'];
						enfermedad['agente'] = results.rows.item(0)['agente'];
						enfermedad['descripcion'] = results.rows.item(0)['descripcion'];
						enfermedad['recomendaciones'] = results.rows.item(0)['recomendaciones'];
						enfermedad['preventivo'] = results.rows.item(0)['preventivo'];
						enfermedad['curativo'] = results.rows.item(0)['curativo'];
						enfermedad['ornamental'] = results.rows.item(0)['ornamental'];
						enfermedad['cultivo'] = results.rows.item(0)['cultivo'];
					  	noEnfermedad = false;
					}else{
					  	noEnfermedad = true;
					}
					eh.emit('llenarEnfermedad');
				}, null);
			});
		}


		//Busqueda de Enfermedades
		function buscarEnfermedades(palabra){
			db.transaction(function (tx){
				condicion = 'replace(E.nombre,"á","a") like "%'+palabra+'%" OR replace(E.nombre,"é","e") like "%'+palabra+'%" OR replace(E.nombre,"í","i") like "%'+palabra+'%" OR replace(E.nombre,"ó","o") like "%'+palabra+'%" OR replace(E.nombre,"ú","u") like "%'+palabra+'%" OR replace(P.nombre,"á","a") like "%'+palabra+'%" OR replace(P.nombre,"é","e") like "%'+palabra+'%" OR replace(P.nombre,"í","i") like "%'+palabra+'%" OR replace(P.nombre,"ó","o") like "%'+palabra+'%" OR replace(P.nombre,"ú","u") like "%'+palabra+'%"  ';
				tx.executeSql('SELECT E.id as id, E.nombre as enfermedad, P.nombre as cultivo FROM `enfermedad` E INNER JOIN propiedad P ON E.cultivo_id = P.id WHERE '+condicion+';', [], function (tx, results){
					var len = results.rows.length;
					resultado = '<ul class="resultadoEnfermedad">';
					if(len>0){
						for(var i = 0; i < len; i++){
							resultado += '<li data-id="'+results.rows.item(i)['id']+'">'+ icon_caret_right +'<span>'+results.rows.item(i)['enfermedad']+'</span</li>'
						}
					}else{
						resultado += '<li>'+ icon_warning +'<span>No se encontraron coincidencias</span</li>';
					}
					resultado += '</ul>';
					searchScreen.cargarContenido(resultado);
				});
			});
		}

		//Carga los agentes para cada enfermedad
		function cargarEnfermedadesAgente(agente){
			db.transaction(function (tx){
				tx.executeSql('SELECT E.id as id, E.nombre as enfermedad, P.nombre as cultivo FROM `enfermedad` E INNER JOIN propiedad P ON E.cultivo_id = P.id WHERE agente like "'+agente+'%" GROUP BY E.nombre;', [], function (tx, results){
					var len = results.rows.length;
					if(len>0){
						listaEnfermedades = '<ul class="listaEnfermedad">';
						for(var i = 0; i < len; i++){
							listaEnfermedades += '<li class="fromAgente" data-id="'+results.rows.item(i)['id']+'">'+ icon_caret_right +'<span>'+results.rows.item(i)['enfermedad']+'</span</li>'
						}
						listaEnfermedades += '</ul>';

						summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
						summitScreens.show(detailScreen.screen);
						detailScreen.cargarContenido(listaEnfermedades);
						detailScreen.headerContent.setContent('<h2>Enfermedades agente</h2>');
					}
				});
			});
		}

		// Carga las enfermedades de los cultivos
		function cargarEnfermedadesCultivo(id){
			db.transaction(function (tx){
				tx.executeSql('SELECT * FROM enfermedad WHERE cultivo_id = ? GROUP BY nombre;', [id], function (tx, results){
					var len = results.rows.length;
					if(len>0){
						listaEnfermedades = '<ul class="listaEnfermedad">';
						for(var i = 0; i < len; i++){
							listaEnfermedades += '<li data-id="'+results.rows.item(i)['id']+'">'+ icon_caret_right +'<span>'+results.rows.item(i)['nombre']+'</span></li>'
						}
						listaEnfermedades += '</ul>';

						summitScreens.setOptions({
			                inTransition: true,
			                outTransition: true
			            });
						summitScreens.show(detailScreen.screen);
						detailScreen.cargarContenido(listaEnfermedades);
						detailScreen.headerContent.setContent("<h2>Enfermedades cultivo</h2>");
					}
				});
			});
		}

		//Busca una Enfermedad Utilizando el Id
		function searchEnfermedadByID(id) {
			for ( var i =0; i< enfermedades.length; i++){
				if ( enfermedades[i].id == id ){ 
					return enfermedades[i].products 
				} 
			}
			return null;
		}


		//Buscar un Producto Basado en el Id
		function buscarProducto(id){
			db.transaction(function (tx){
				tx.executeSql('SELECT * FROM PRODUCTO WHERE id=?', [id], function (tx, results){
					var len = results.rows.length;
					if(len>0){
						producto = new Object;
						producto['imagen'] = results.rows.item(0)['imagen'];
						producto['nombre'] = results.rows.item(0)['nombre'];
						producto['descripcion'] = results.rows.item(0)['descripcion'];
						producto['instrucciones'] = results.rows.item(0)['instrucciones'];
						producto['precauciones'] = results.rows.item(0)['precauciones'];
						producto['auxilios'] = results.rows.item(0)['auxilios'];
						producto['medioAmbiente'] = results.rows.item(0)['medioAmbiente'];
						eh.emit('llenarProducto');
					}
				}, null);
			});
		}

		//Calculo del ancho total de la pantalla
		function anchoTotal(ancho){
			ancho = ancho || false;
			if (window.screen.height > window.screen.width || ancho)
				return window.screen.width;
			else
				return window.screen.height;
		}

		//Calculo del largo total de la pantalla
		function largoTotal(){
			return window.screen.height;
		}

		//Revisa si una cadena esta vacia 
		function empty(str){
			if (typeof str == 'undefined' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === ""){
				return true;
			}else{
				return false;
			}
		}


		// Realiza un chequeo en caso de que exista un script disponible de importación, en caso afirmativo, realiza el respaldo
		function openDB(){
			try{
				var dname  = 'DBSummitX';
				db = window.openDatabase(dname, "1.9.3", "SummitAgross", 2000000);
				var runned = mainStorage.getItem('runned');

				if(runned != "30"){	
					jQuery(".appOverlay").fadeOut();
					jQuery('.loadingMessage').text('Cargando Base de datos');
					jQuery.ajax({
						method: 'get',
						url: './summitagro.sql',
						success: function(response) {
							processQuery(2, response.split(';\n'), dname);
						}
					});
				}else{
					jQuery('.loadingMessage').text('Listo');
					jQuery(".appOverlay").fadeOut();
					startUI();
					iniciarApp();
				}

			}catch(err){
				alert("Hubo un error en el acceso a Base de datos, no es posible utilizar la aplicación");
				navigator.app.exitApp();
			}
				
		}

		// Proceso para ejecutar una serie de scripts en una base de datos.
		function processQuery(i, queries, dbname) {
			jQuery('.loadingMessage').text('Carga inicial de Datos:'+ Math.round(i*100/queries.length)+"%");
			if(i < queries.length -1) {
				if(!queries[i+1].match(/(INSERT|CREATE|DROP|PRAGMA|BEGIN|COMMIT)/)) {
					queries[i+1] = queries[i]+ ';\n' + queries[i+1];
					return processQuery(i+1, queries, dbname);
				}
				try{
				db.transaction( function (query){
								query.executeSql(queries[i]+';', [], function(tx, result) {
									processQuery(i +1, queries,dbname);
									});
								}, function(err) {
    									console.log("Query error in ", queries[i], err.message);
										processQuery(i +1, queries, dbname);
								});
				}catch(err){
					alert("Error: "+err);
				}
			} else {
				var LSsupport = !(typeof mainStorage == 'undefined');
				var SSsupport = !(typeof window.sessionStorage == 'undefined');
				try{
					if (LSsupport && SSsupport) {
					    mainStorage.setItem("runned","30");
					}
				}catch(err){
					alert(err);
				}
				startUI();
				iniciarApp();
				console.log("Done importing!");
			}
		}

		


//-------------------------------------- Funciones de Interfaz de Usuario ------------------------------------------------
		var xDown = null,yDown = null;


		function handleTouchStart(evt) {
		    xDown = evt.touches[0].clientX;
		    yDown = evt.touches[0].clientY;

		}


		function handleTouchMove(evt) {
			if ( ! xDown || ! yDown ) {
				return;
			}
			var xUp = evt.touches[0].clientX;
		    var yUp = evt.touches[0].clientY;

		    var xDiff = xDown - xUp;
		    var yDiff = yDown - yUp;

		    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) { // most significant
		        if ( xDiff > 0 ) {
		            //------------------------------ left swipe 
								if(mostrarMenu == true)
									ocultarMenu();
		        } else {
		            if(mostrarMenu != true && xDown < 250  && currentMenu == 'home')
						jQuery('#button-menu').trigger('click');
		        }
		    } else {
		        if ( yDiff > 0 ) {
		            //------------------------------------------------ up swipe 
		        } else {
		            // ---------------------------------------------------down swipe 
		        }
		    }
		    // reset values 
		    xDown = null;
		    yDown = null;
		}


		function doMenu(){
			if (mostrarMenu != true && currentMenu == 'home'){
				jQuery('#button-menu').trigger('click');
			}
		}

		function ocultarBuscar(){
			currentMenu = 'home';
			summitScreens.setOptions({
				overlap:false,
                inTransition: true,
                outTransition: true
            });
			summitScreens.show(appScreen.screen);
			jQuery("#searchField").val('');
			searchScreen.cargarContenido('');
		}


		function ocultarMenu(){
			jQuery('.menuoverlay').trigger('click');
		}


		function cargarPagina(obj){
			 if(obj.classList.contains('menuActivo') == false || 
			 	obj.attributes.id.value == 'enfermedades' || 
			 	document.getElementsByClassName('resultadoEnfermedad').length > 0){
				
				jQuery('.menuActivo').removeClass('menuActivo');
				jQuery(obj).addClass('menuActivo');

			 }

			if(mostrarMenu == true){
				ocultarBuscar();
			}

			setTimeout(function(){
				ocultarMenu();
			} ,100);

		}


	
		function cargarBuscador() {
			var cultivo = 	generateDOM (json_cultivos,'cultivo','cultivo','green');
			var enf = 	generateDOM (json_enfermedades,'enfermedad','enfermedad','gray');
			var ing = 	generateDOM (json_ingrediente,'ingrendiente','ingrendiente activo','gray');
			var seg = 	generateDOM (json_segmentos,'segmento','segmento','gray');
			var ins = 	generateDOM (json_insectos,'insecto','insecto','gray');
			var ht = '<div class="formulario">' + cultivo + enf + ing+ seg + ins + '</div>';

			jQuery('li.menuActivo').removeClass('menuActivo');
			jQuery('#advanced_search').addClass('menuActivo');

			appScreen.cargarContenido('buscador',{inTransition: true, outTransition: false}).setContent(ht);
			appScreen.headerContent.setContent('<h2>Búsqueda avanzada</h2>');
		}


		function onBackKeyDown(){
			if ( $('.lightbox').css('display') != 'none' ){
				$('.lightbox').fadeOut('fast');
			    // element is hidden
			    return;
			}


			if(mostrarMenu == true){
				ocultarMenu();
				return;
			}

			if(currentMenu == 'producto'){
					ocultarProducto();
					return;	
			} 

			if(currentMenu == 'manual_bacterias' ||
				currentMenu == 'enfermedades' ||
				currentMenu == 'enfermedades_agente' ||
				currentMenu == 'buscador'){
					summitScreens.setOptions({
						overlap:false,
		                inTransition: true,
		                outTransition: true
		            });
					summitScreens.show(appScreen.screen);
					
					if(currentMenu == 'enfermedades'){
						setTimeout( function(){
							jQuery('#tab1').click();
						}, 1000);		
					}

					if(currentMenu == 'enfermedades_agente'){
						setTimeout( function(){
							jQuery('#tab2').click();
						}, 1000);
					}

					currentMenu = 'home';
					return;
			}

			if(currentMenu == 'detalle_enfermedad' ||
				currentMenu == 'detalle_enfermedad_from_agente' ||
				currentMenu == 'buscador_producto'){
				summitScreens.setOptions({
						overlap:false,
		                inTransition: true,
		                outTransition: true
		            });
				summitScreens.show(detailScreen.screen);
				
				if(currentMenu == 'detalle_enfermedad_from_agente'){
					currentMenu = 'enfermedades_agente';
				}else if(currentMenu == 'detalle_enfermedad'){
					currentMenu = 'enfermedades';
				}else if(currentMenu == 'buscador_producto'){
					currentMenu = 'buscador';
				}
				return;
			}

			if(currentMenu == 'detalle_enfermedad_from_busqueda'){
				summitScreens.setOptions({
						overlap:false,
		                inTransition: true,
		                outTransition: true
		            });
				summitScreens.show(searchScreen.screen);
				currentMenu = "buscador_texto"
				return;
			}

			if(currentMenu == "buscador_texto"){
				currentMenu = 'home';
				ocultarBuscar();
				return;
			}

			exit();
		}


		function showConfirm(message, callback, buttonLabels, title){
		    buttonLabels = buttonLabels || 'OK,Cancel';
		    title = title || "default title";
		    if(navigator.notification && navigator.notification.confirm){
		            var _callback = function(index){
		                if(callback)
		                    callback(index == 1);
		            };
		            navigator.notification.confirm(
		                message,
		                _callback,
		                title,
		                buttonLabels
		            );
		            return null;
		    } else {
		        return confirm(message);
		    }
		}


		function exit(){
			var res = showConfirm('Desea salir?', onConfirmQuit, 'Sí, No', 'Cerrar');
			if(res != null){
				onConfirmQuit(res);
			}
		}


		function onConfirmQuit(button){
			if(button == true)
		 		navigator.app.exitApp();
		}

//------------------------------------------------------------------------------------------------------------------------
		
		// Iniciar Interfaz de usuario
		function startUI(){

			document.addEventListener("menubutton", doMenu, false);
			document.addEventListener("backbutton", onBackKeyDown, false);
			document.addEventListener('touchstart', handleTouchStart, false);
			document.addEventListener('touchmove', handleTouchMove, false);

			summitScreens.setOptions({
                inTransition: true,
                outTransition: false
            });

			appScreen.cargarContenido('inicio',{inTransition: false, outTransition: false});
			summitScreens.show(appScreen.screen);


			jQuery('<div/>', {
			    class: 'lightbox',
			}).appendTo('body');

			jQuery( window ).resize(function() {
			  appScreen.refreshScroll();
			  detailScreen.refreshScroll();
			  searchScreen.refreshScroll();
			  enfermedadDetailScreen.refreshScroll();
			  productoDetailScreen.refreshScroll();
			});
            // Funcionalidad del Menu

			jQuery('body').on('click', '#button-menu', function (e){
				if(currentMenu == 'home'){
					mostrarMenu = true;
					jQuery('.menuoverlay').fadeIn('fast', function() {
						menuModifier.setOrigin([0,0],{duration:400, curve: Easing.outExpo});
					});
				}
			});

			jQuery('body').on('click','.button-up',function (e){
				productoDetailScreen.refreshScroll();
				//jQuery('.productoScroll').stop().animate({scrollTop:0}, '500', 'swing', function(){});
			});

			
			jQuery('.menuoverlay').on('click', function (e){
				mostrarMenu = false;
				menuModifier.setOrigin([1,0],{duration:400, curve: Easing.outExpo},function(){
					jQuery('.menuoverlay').fadeOut('fast');
				});
			});

			jQuery('#inicio').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('inicio',{inTransition: true, outTransition: true});
				cargarPagina (this)
				appScreen.headerContent.setContent(titulo);
			});

			jQuery('#nosotros').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('nosotros',{inTransition: true, outTransition: true});
				cargarPagina (this)
				appScreen.headerContent.setContent('<h2>Nosotros</h2>');
			});

			jQuery('#contacto').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('contacto',{inTransition: true, outTransition: true});
				cargarPagina(this);
				appScreen.headerContent.setContent('<h2>Contacto</h2>');
			});

			jQuery('#productos').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('productos',{inTransition: true, outTransition: true}).setContent(imgProductos);
				cargarPagina(this);
				appScreen.headerContent.setContent('<h2>Productos</h2>');
			});

			jQuery('#segmentos').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('segmentos',{inTransition: true, outTransition: true}).setContent(paginaSegmentos);
				cargarPagina(this);
				appScreen.headerContent.setContent('<h2>Segmentos</h2>');
			});

			jQuery('#enfermedades').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				appScreen.cargarContenido('enfermedades',{inTransition: true, outTransition: true}).setContent(htmlListaEnfermedad);
				cargarPagina(this);
				appScreen.headerContent.setContent('<h2>Enfermedades</h2>');
				setTimeout( function(){
					jQuery('#tab1').click();
				}, 1000);
			});

			jQuery('#manualBacterias').on('click', function(){
				if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
				currentMenu = 'manual_bacterias';
				appScreen.cargarContenido('manual',{inTransition: true, outTransition: true}).setContent(generalidades);
				cargarPagina(this);
				appScreen.headerContent.setContent('<h2>Manual de bacterias</h2>');
			});

			jQuery('#advanced_search').on('click', function(){
					if(jQuery(this).hasClass('menuActivo')){ocultarMenu(); return;}
					cargarPagina (this);
					cargarBuscador();
			});

			// Elementos internos ------------------------------------------------------------------------------------------------------------
			jQuery('body').on('click', '[id^="tab"]', function(){
				jQuery('.tab-content').hide();
				jQuery('#tab-content' + this.id[3]).show();
			});

			jQuery('body').on('click', '.enlace_producto', function(){
				jQuery('#productos').trigger('click');
			});

			jQuery('body').on('click', '.enlace_enfermedad', function(){
				jQuery('#enfermedades').trigger('click');
			});

			jQuery('body').on('click', '.enlace_manual', function(){
				jQuery('#manualBacterias').trigger('click');
			});

			jQuery('body').on('click', '.itemProducto', function (e){
				if(mostrarMenu != true){
					currentMenu = 'producto';
					buscarProducto(this.dataset.id);
				}
			});

			

			// -------------------------------------------------------------------- <- Boton de retorno
			jQuery('body').on('click', '.button-back', function (e){
				 e.stopPropagation();
				if(currentMenu == 'producto'){
					ocultarProducto();
					return;	
				} 

				if(currentMenu == 'manual_bacterias' ||
					currentMenu == 'enfermedades' ||
					currentMenu == 'enfermedades_agente' ||
					currentMenu == 'buscador'){
						summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
						summitScreens.show(appScreen.screen);
						
						if(currentMenu == 'enfermedades'){
							setTimeout( function(){
								jQuery('#tab1').click();
							}, 1000);		
						}

						if(currentMenu == 'enfermedades_agente'){
							setTimeout( function(){
								jQuery('#tab2').click();
							}, 1000);
						}

						currentMenu = 'home';
						return;
				}

				if(currentMenu == 'detalle_enfermedad' ||
					currentMenu == 'detalle_enfermedad_from_agente' ||
					currentMenu == 'buscador_producto'){
					summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
					summitScreens.show(detailScreen.screen);
					
					if(currentMenu == 'detalle_enfermedad_from_agente'){
						currentMenu = 'enfermedades_agente';
					}else if(currentMenu == 'detalle_enfermedad'){
						currentMenu = 'enfermedades';
					}else if(currentMenu == 'buscador_producto'){
						currentMenu = 'buscador';
					}
					return;
				}

				if(currentMenu == 'detalle_enfermedad_from_busqueda'){
					summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
					summitScreens.show(searchScreen.screen);
					currentMenu = "buscador_texto"
				}
			});

			// Click en cada elemento de los productos
			jQuery('body').on('click', '.tap_button', function(e){
				e.stopPropagation();
				var itemData = jQuery(this).attr('data');
				jQuery(this).toggleClass( "openItem" );
				jQuery('#' + itemData).toggle();
				jQuery('#' + itemData).toggleClass( "openItem" );
				if(jQuery(this).hasClass( "openItem" )){
					jQuery(this).find('svg').removeClass('icon-angle-right').addClass('icon-angle-down');
					jQuery(this).find('use').attr('xlink:href','#icon-angle-down');
				}else{
					jQuery(this).find('svg').removeClass('icon-angle-down').addClass('icon-angle-right');
					jQuery(this).find('use').attr('xlink:href','#icon-angle-right');
				}
				
			});

			jQuery('body').on('click','.tabTipo',function(e){
				e.stopPropagation();
				var itemData = jQuery(this).attr('data');
				jQuery(this).toggleClass( "openItem" );
				jQuery('#' + itemData).toggle();
				jQuery('#' + itemData).toggleClass( "openItem" );
				if(jQuery(this).hasClass( "openItem" )){
					jQuery(this).find('svg').removeClass('icon-angle-right').addClass('icon-angle-down');
					jQuery(this).find('use').attr('xlink:href','#icon-angle-down');
				}else{
					jQuery(this).find('svg').removeClass('icon-angle-down').addClass('icon-angle-right');
					jQuery(this).find('use').attr('xlink:href','#icon-angle-right');
				}
			});

			jQuery("body").on('click','a.image_zoom',function(){
				var itemData = jQuery(this).attr('data');
				jQuery(".lightbox").html('<img src="'+itemData+'"/>');
					jQuery(".lightbox").fadeIn('fast', function() {
				});
			});

			jQuery("body").on('click','.lightbox',function(){
				jQuery(".lightbox").fadeOut('fast', function() {
				});
			});

			// Click en cada uno de los elementos de las generalidades
			jQuery('body').on('click', '.manual .generalidades li', function(){
				currentMenu = 'manual_bacterias';
				summitScreens.setOptions({
	                inTransition: true,
	                outTransition: true
	            });

				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(generalidad[jQuery(this).index()]);
				detailScreen.headerContent.setContent("<h2>Manual de bacterias</h2>");
				return false;
			});


			// Click en cada elemento de cultivo
			jQuery('body').on('click', '.listaCultivo .itemCultivo', function(){
				currentMenu = 'enfermedades';
				
				if(mostrarMenu != true)
					cargarEnfermedadesCultivo(this.dataset.id);
			});

			// En la Pantalla de Enfermedades , Manejo del click de cada elemento del tab de Cultivo

			jQuery('body').on('click', '.listaEnfermedad li', function(){

				currentMenu = 'detalle_enfermedad';
				if(jQuery(this).hasClass('fromAgente')){
					currentMenu = 'detalle_enfermedad_from_agente';
				}

				if(mostrarMenu != true){
					buscarEnfermedad(this.dataset.id);
				}
			});

			// En la Pantalla de Enfermedades , Manejo dle click de cada elemento del tab de Agente 

			jQuery('body').on('click', '.listaAgente li', function(){
				currentMenu='enfermedades_agente'
				if(mostrarMenu != true){
					obj = this;
					cargarEnfermedadesAgente(obj.children.item(1).innerHTML);
				}
			});

			//----------------------------------------------------------------------------------------------------- Componentes de Búsqueda
			jQuery(document).on('focus','.selectorxd', function(){
				jQuery('html, body').animate({scrollTop:0,scrollLeft:0}, 'slow');
			});

			jQuery(document).on('change', '#cultivo', function(e){
				var name  = jQuery(this).val();
				var productos = productosByCultivo(name);
				var html = renderProductSummit(productos);

				summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(html);
				detailScreen.headerContent.setContent('<h2>'+name+'</h2>');
				currentMenu = 'buscador';
				jQuery(this).val('0');
			});


			jQuery(document).on('change', '#enfermedad', function(e){
				var name  = jQuery(this).val();
				var productos = productosByEnfermedad(name);
				var html = renderProductSummit(productos);
				summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(html);
				detailScreen.headerContent.setContent('<h2>'+name+'</h2>');
				currentMenu = 'buscador';
				jQuery(this).val('0');
			});


			jQuery(document).on('change', '#ingrendiente', function(e){
				var name  = jQuery(this).val();
				var productos = productosByIngrediente(name);
				var html = renderProductSummit(productos);
				summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(html);
				detailScreen.headerContent.setContent('<h2>'+name+'</h2>');
				currentMenu = 'buscador';
				jQuery(this).val('0');
			});

			jQuery(document).on('change', '#segmento', function(e){
				var name  = jQuery(this).val();
				var productos = productosBySegmento(name);
				var html = renderProductSummit(productos);
				summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(html);
				detailScreen.headerContent.setContent('<h2>'+name+'</h2>');
				currentMenu = 'buscador';
				jQuery(this).val('0');
			});

			jQuery(document).on('change', '#insecto', function(e){
				var name  = jQuery(this).val();
				var productos = productosByInsecto(name);
				var html = renderProductSummit(productos);
				summitScreens.setOptions({
							overlap:false,
			                inTransition: true,
			                outTransition: true
			            });
				summitScreens.show(detailScreen.screen);
				detailScreen.cargarContenido(html);
				detailScreen.headerContent.setContent('<h2>'+name+'</h2>');
				currentMenu = 'buscador';
				jQuery(this).val('0');
			});

			jQuery('body').on('click', '.tablesummit', function (e){
				// console.log("Click en producto");
				currentMenu = "buscador_producto";
				if(mostrarMenu != true)
					buscarProducto(jQuery(this).data('id'));
			});

			jQuery('body').on('click', '.contacto a', function(e){
			  	if ( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
						e.preventDefault();
						window.open('https://maps.google.com.mx/maps?f=q&source=embed&hl=es&geocode=&q=Ruben+Dario+No.+281,+Col.+Bosque+de+Chapultepec&aq=&sll=19.447007,-99.220877&sspn=0.055925,0.077162&ie=UTF8&hq=&hnear=Rub%C3%A9n+Dar%C3%ADo+281,+Rinc%C3%B3n+del+Bosque,+Miguel+Hidalgo,+11580+Ciudad+de+M%C3%A9xico,+Distrito+Federal&t=m&ll=19.437943,-99.207745&spn=0.0259,0.036135&z=14&iwloc=A', '_system');
			    }
			});

			jQuery('body').on('click', '#button-search', function(e){

				summitScreens.setOptions({
							overlap:false,
			                inTransition: false,
			                outTransition: false
			            });
				summitScreens.show(searchScreen.screen);
				searchScreen.cargarContenido('<span class="noResults">Por favor, Ingrese algún tema de Búsqueda</span>');
				currentMenu = 'buscador_texto';
				
			});

			jQuery('body').on('click', '.button-close', function(e){
				ocultarBuscar();
				
			});

			jQuery('body').on('keyup', '#searchField', function(e){
				if(jQuery(this).val().length >= 1){
					if(jQuery(this).data('word') != jQuery(this).val()){
						searchScreen.cargarContenido(div_loading);
						buscarEnfermedades(jQuery(this).val());
						jQuery(this).data('word', jQuery(this).val());
						return;
					} 
				} 

				searchScreen.cargarContenido('<span class="noResults">Por favor, Ingrese algún tema de Búsqueda</span>');	
			});


			jQuery('body').on('click', '.resultadoEnfermedad li', function(){
				currentMenu = 'detalle_enfermedad_from_busqueda';
				if(mostrarMenu != true){
					buscarEnfermedad(this.dataset.id);
				}
			});
			
		}
 
		//Proceso para consultar toda la informacion de la base de datos y generar HTML para mostrarla
		function iniciarApp(){
			window.btk = db;
			productoPorTipo = {};
			paginaSegmentos = "";
			// consulta de productos 
			db.transaction(function (tx){
						tx.executeSql('SELECT id, nombre, tipo FROM PRODUCTO;', [],function (tx, results){
							console.log(tx );
							var len = results.rows.length;
							if(len>0)
							{
								console.log("Cantidad: " +len);
								imgProductos =  '<div class="tituloProducto">Productos</div><div class="productos">';
								for (var i = 0; i < len; i++) {
									var tipoRow = results.rows.item(i).tipo?results.rows.item(i).tipo:'8';
									if(!productoPorTipo[tipoRow]){
										productoPorTipo[tipoRow] = [];
									}
									productoPorTipo[tipoRow].push('<img class="itemProducto tipo-'+tipoRow+'"  src="img/productos/'+results.rows.item(i).id+'/logo.jpg" data-id="'+results.rows.item(i).id+'">');
									
									imgProductos += '<img class="itemProducto tipo-'+tipoRow+'"  src="img/productos/'+results.rows.item(i).id+'/logo.jpg" data-id="'+results.rows.item(i).id+'">';
								}
								imgProductos += '</div></div>';
								
								for(var ty in productoPorTipo){
									paginaSegmentos += '<div class="tabTipo tipo-'+ty+'" data="contenidoTipo'+ty+'"><h5>'+titulosTiposProducto[ty]+'</h5><svg class="icon icon-angle-right"><use xlink:href="#icon-angle-right"></use></svg></div>';
									paginaSegmentos += '<div id="contenidoTipo'+ty+'">';
									for(var j=0; j < productoPorTipo[ty].length; j++){
										paginaSegmentos += productoPorTipo[ty][j];
									}
									paginaSegmentos += '</div>'
								}
							}
						}, null);
					});

			//consulta de enfermedades
			db.transaction(function (tx){
				tx.executeSql('SELECT P.id, P.nombre FROM enfermedad E INNER JOIN propiedad P ON E.cultivo_id = P.id GROUP BY P.nombre ORDER BY lower(P.nombre)', [], function (tx, results){
					var len = results.rows.length;
					if(len>0){
						listaCultivo = '<div class="listaCultivo">';
						for(var i = 0; i < len; i++){
							var img = results.rows.item(i)['nombre'].toLowerCase();
							if (img == 'calabacita' || img == 'crisantemo')
								img += '.jpg';
							else
								img += '.png';
							img = img.replace('á', 'a');
							img = img.replace('é', 'e');
							img = img.replace('í', 'i');
							img = img.replace('ó', 'o');
							img = img.replace('ú', 'u');
							img = img.replace('ñ', 'n');
							listaCultivo += '<div class="itemCultivo" data-id="'+results.rows.item(i)['id']+'"> \
							<img src="img/cultivos/'+img+'" /> \
							<span>'+ results.rows.item(i)['nombre'][0].toUpperCase() + results.rows.item(i)['nombre'].slice(1) +
							'</span></div>';
						}
						listaCultivo += '</div>';
					}
				})
			}, null);

			//consulta de agentes 
			db.transaction(function (tx){
				tx.executeSql('SELECT `enfermedad`.`agente` tipoAgente FROM `enfermedad` group BY `enfermedad`.`agente` ORDER BY `agente` ASC', [], function (tx, results){
					var len = results.rows.length;
					if(len>0){
						var tipos = [];
						for (var i = 0; i < len; i++) {
							var tipo = results.rows.item(i)['tipoAgente'].split(' ')[0];
							if (tipos.indexOf(tipo) < 0)
								tipos.push(tipo);
						};
						listaAgente = '<ul class="listaAgente">';
						for(var i = 0; i < tipos.length; i++){
							if ( tipos[i].length > 2){
								listaAgente += '<li class="agentList">'+ icon_caret_right +'<span>'+ tipos[i] +'</span></li>';
							}
						}
						listaAgente += '</ul>';
						htmlListaEnfermedad = '<div class="tabs"><input type="radio" name="tabs" id="tab1" checked> <label for="tab1"><span>Cultivo</span> </label><input type="radio" name="tabs" id="tab2"> <label for="tab2"><span>Agente</span></label><div id="tab-content1" class="tab-content">'+ listaCultivo +'</div><div id="tab-content2" class="tab-content">'+ listaAgente +'</div></div>';
					}
				})
			}, null);
		}


// ------------------------------------------------   Return Object ----------------------------------------------------------

		return {
			initialize:initialize
		};

	});