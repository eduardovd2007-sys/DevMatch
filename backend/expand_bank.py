import json

# Existing file paths
banco_path = "src/data/bancoPreguntas.ts"

# The new dictionary of questions for the 30 missing technologies
new_questions = {
    "Java": [
        {"pregunta": "¿Qué es la JVM?", "opciones": ["Java Virtual Machine", "Java Version Manager", "Un tipo de variable", "Un IDE"], "correcta": "Java Virtual Machine"},
        {"pregunta": "¿Qué modificador de acceso hace que un miembro sea accesible solo dentro de su propia clase?", "opciones": ["public", "protected", "private", "default"], "correcta": "private"},
        {"pregunta": "¿Qué interfaz implementa una clase para permitir que sus objetos sean ordenados?", "opciones": ["Comparable", "Serializable", "Cloneable", "Runnable"], "correcta": "Comparable"},
        {"pregunta": "¿Qué es un recolector de basura (Garbage Collector) en Java?", "opciones": ["Una herramienta para borrar archivos", "Un proceso que libera memoria ocupada por objetos no referenciados", "Un comando del compilador", "Un patrón de diseño"], "correcta": "Un proceso que libera memoria ocupada por objetos no referenciados"},
        {"pregunta": "¿Cuál de las siguientes colecciones no permite elementos duplicados?", "opciones": ["ArrayList", "LinkedList", "HashSet", "Vector"], "correcta": "HashSet"}
    ],
    "Go": [
        {"pregunta": "¿Qué palabra clave se usa para iniciar una goroutine?", "opciones": ["thread", "async", "go", "start"], "correcta": "go"},
        {"pregunta": "¿Cuál es el tipo de datos principal para manejar concurrencia segura en Go?", "opciones": ["Mutex", "Channel", "Promise", "Thread"], "correcta": "Channel"},
        {"pregunta": "¿Cómo se exporta una función en Go para que sea visible desde otros paquetes?", "opciones": ["Usando la palabra clave 'export'", "Capitalizando la primera letra del nombre", "Usando el decorador @public", "Todas las anteriores"], "correcta": "Capitalizando la primera letra del nombre"},
        {"pregunta": "¿Qué es 'defer' en Go?", "opciones": ["Retrasa la compilación", "Ejecuta una función justo antes de que retorne la función actual", "Declara una variable asíncrona", "Maneja errores de red"], "correcta": "Ejecuta una función justo antes de que retorne la función actual"},
        {"pregunta": "¿Go tiene clases y herencia tradicional?", "opciones": ["Sí", "No, usa structs e interfaces", "Solo en la versión 2.0", "Usa prototipos como JS"], "correcta": "No, usa structs e interfaces"}
    ],
    "Rust": [
        {"pregunta": "¿Qué característica principal de Rust previene los errores de memoria sin usar un recolector de basura?", "opciones": ["El compilador JIT", "El sistema de Ownership y Borrowing", "Uso de punteros nulos", "Contadores de referencias automáticos"], "correcta": "El sistema de Ownership y Borrowing"},
        {"pregunta": "¿Qué herramienta oficial se usa para gestionar dependencias y compilar proyectos en Rust?", "opciones": ["npm", "pip", "cargo", "gradle"], "correcta": "cargo"},
        {"pregunta": "¿Qué es un 'trait' en Rust?", "opciones": ["Un error de compilación", "Un tipo de variable estática", "Un mecanismo para definir comportamientos compartidos, similar a las interfaces", "Una librería estándar"], "correcta": "Un mecanismo para definir comportamientos compartidos, similar a las interfaces"},
        {"pregunta": "¿Qué macro se usa comúnmente para imprimir en consola en Rust?", "opciones": ["print()", "console.log()", "println!()", "echo"], "correcta": "println!()"},
        {"pregunta": "¿Qué tipo de dato en Rust se usa para manejar valores que pueden ser nulos o ausentes?", "opciones": ["null", "Option<T>", "undefined", "Result<T, E>"], "correcta": "Option<T>"}
    ],
    "Kotlin": [
        {"pregunta": "¿Qué tipo de seguridad ofrece Kotlin por defecto para evitar NullPointerExceptions?", "opciones": ["Seguridad de hilos", "Seguridad de memoria estricta", "Null Safety (Tipos no nulables por defecto)", "No tiene seguridad especial"], "correcta": "Null Safety (Tipos no nulables por defecto)"},
        {"pregunta": "¿Cuál es la palabra clave para definir una variable mutable en Kotlin?", "opciones": ["val", "let", "var", "const"], "correcta": "var"},
        {"pregunta": "¿Qué son las Coroutines en Kotlin?", "opciones": ["Hilos del sistema operativo", "Un patrón arquitectónico", "Un marco de concurrencia ligera para programación asíncrona", "Funciones matemáticas complejas"], "correcta": "Un marco de concurrencia ligera para programación asíncrona"},
        {"pregunta": "¿Cómo se define una función en Kotlin?", "opciones": ["def", "function", "fun", "func"], "correcta": "fun"},
        {"pregunta": "¿Es Kotlin interoperable con Java?", "opciones": ["No, compilan distinto", "Sí, 100% interoperable", "Solo si se usa un adaptador especial", "Solo a partir de Java 11"], "correcta": "Sí, 100% interoperable"}
    ],
    "Swift": [
        {"pregunta": "¿Para qué ecosistema está diseñado principalmente Swift?", "opciones": ["Windows", "Android", "Apple (iOS, macOS, etc.)", "Linux"], "correcta": "Apple (iOS, macOS, etc.)"},
        {"pregunta": "¿Qué símbolo se usa en Swift para desempaquetar (unwrap) un opcional de manera forzada?", "opciones": ["?", "!", "*", "&"], "correcta": "!"},
        {"pregunta": "¿Qué palabra clave se usa para definir una constante en Swift?", "opciones": ["let", "var", "const", "final"], "correcta": "let"},
        {"pregunta": "¿Qué es un 'struct' en Swift a diferencia de una 'class'?", "opciones": ["Struct es tipo por referencia, Class es tipo por valor", "Struct es tipo por valor, Class es tipo por referencia", "Son exactamente lo mismo", "Struct solo guarda enteros"], "correcta": "Struct es tipo por valor, Class es tipo por referencia"},
        {"pregunta": "¿Qué protocolo en Swift se usa para decodificar/codificar JSON automáticamente?", "opciones": ["JSONParser", "Codable", "Serializable", "Parseable"], "correcta": "Codable"}
    ],
    "PHP": [
        {"pregunta": "¿Qué símbolo precede siempre a las variables en PHP?", "opciones": ["@", "#", "$", "%"], "correcta": "$"},
        {"pregunta": "¿Cuál de las siguientes es una función para imprimir texto en PHP?", "opciones": ["print_text", "System.out.println", "echo", "console.log"], "correcta": "echo"},
        {"pregunta": "¿Qué gestor de dependencias es el estándar de facto en PHP moderno?", "opciones": ["NPM", "Composer", "PEAR", "Maven"], "correcta": "Composer"},
        {"pregunta": "¿Qué superglobal se usa para recolectar datos de un formulario enviado por el método POST?", "opciones": ["$_GET", "$_REQUEST", "$_POST", "$_FORM"], "correcta": "$_POST"},
        {"pregunta": "¿Qué palabra clave se usa para instanciar un objeto en PHP?", "opciones": ["create", "new", "make", "instantiate"], "correcta": "new"}
    ],
    "Ruby": [
        {"pregunta": "¿Qué framework web es el más famoso y asociado estrechamente con Ruby?", "opciones": ["Django", "Ruby on Rails", "Sinatra", "Spring"], "correcta": "Ruby on Rails"},
        {"pregunta": "¿Cómo se define un método en Ruby?", "opciones": ["function", "def", "fun", "method"], "correcta": "def"},
        {"pregunta": "¿Todo en Ruby es un objeto?", "opciones": ["Falso, los enteros son primitivos", "Cierto, hasta los números simples son objetos", "Solo en Rails", "Depende del compilador"], "correcta": "Cierto, hasta los números simples son objetos"},
        {"pregunta": "¿Qué son los 'Gems' en Ruby?", "opciones": ["Puntos de experiencia", "Librerías o paquetes de software empaquetados", "Herramientas de encriptación", "Variables globales"], "correcta": "Librerías o paquetes de software empaquetados"},
        {"pregunta": "¿Qué símbolo se usa comúnmente para denotar símbolos (Symbols) en Ruby?", "opciones": [":", "@", "$", "#"], "correcta": ":"}
    ],
    "Vue": [
        {"pregunta": "¿Qué directiva se usa en Vue para renderizado condicional?", "opciones": ["v-if", "ng-if", "v-show-if", "data-if"], "correcta": "v-if"},
        {"pregunta": "¿Qué directiva de Vue se usa para enlazar datos bidireccionalmente en un formulario (Two-way data binding)?", "opciones": ["v-bind", "v-model", "v-on", "v-data"], "correcta": "v-model"},
        {"pregunta": "¿Cuál es la función principal de Vuex o Pinia en una aplicación Vue?", "opciones": ["Enrutamiento de páginas", "Manejo centralizado del estado global", "Compilar el CSS", "Realizar peticiones HTTP"], "correcta": "Manejo centralizado del estado global"},
        {"pregunta": "¿Qué ciclo de vida se ejecuta justo después de que el componente es insertado en el DOM?", "opciones": ["created", "mounted", "updated", "destroyed"], "correcta": "mounted"},
        {"pregunta": "¿Cómo se escuchan eventos (como clicks) en el template de Vue?", "opciones": ["onClick", "v-on:click o @click", "bind:click", "v-click"], "correcta": "v-on:click o @click"}
    ],
    "Angular": [
        {"pregunta": "¿Qué lenguaje de programación se usa de forma predeterminada y recomendada en Angular?", "opciones": ["JavaScript", "TypeScript", "Dart", "CoffeeScript"], "correcta": "TypeScript"},
        {"pregunta": "¿Qué decorador se usa para definir un componente en Angular?", "opciones": ["@Module", "@Component", "@Injectable", "@Directive"], "correcta": "@Component"},
        {"pregunta": "¿Qué directiva estructural se usa para iterar sobre una lista en Angular?", "opciones": ["*ngFor", "v-for", "ng-repeat", "for-each"], "correcta": "*ngFor"},
        {"pregunta": "¿Qué herramienta CLI se usa para generar código en Angular?", "opciones": ["ng", "angular-cli", "create-angular", "ng-build"], "correcta": "ng"},
        {"pregunta": "¿Qué módulo se importa para hacer peticiones HTTP en Angular moderno?", "opciones": ["HttpModule", "HttpClientModule", "FetchModule", "AjaxModule"], "correcta": "HttpClientModule"}
    ],
    "Next.js": [
        {"pregunta": "¿Qué tipo de renderizado hace a Next.js tan popular para SEO?", "opciones": ["Client-Side Rendering (CSR)", "Server-Side Rendering (SSR) y Static Site Generation (SSG)", "Renderizado en lienzo (Canvas)", "Ninguno"], "correcta": "Server-Side Rendering (SSR) y Static Site Generation (SSG)"},
        {"pregunta": "¿En Next.js (App Router), cómo se define que un componente debe renderizarse exclusivamente en el cliente?", "opciones": ["export const client = true", "import 'client'", "Añadiendo 'use client' al inicio del archivo", "No se puede"], "correcta": "Añadiendo 'use client' al inicio del archivo"},
        {"pregunta": "¿Qué componente proporciona Next.js para optimizar imágenes automáticamente?", "opciones": ["<Img>", "<Picture>", "<Image>", "<OptimizedImage>"], "correcta": "<Image>"},
        {"pregunta": "¿Cómo funciona el enrutamiento (routing) en Next.js?", "opciones": ["Basado en un archivo central routes.js", "Basado en el sistema de archivos (carpetas y archivos especiales)", "Usa React Router DOM internamente", "No tiene enrutamiento"], "correcta": "Basado en el sistema de archivos (carpetas y archivos especiales)"},
        {"pregunta": "¿Qué función de Next.js (Pages Router) se usa para SSG (Static Site Generation)?", "opciones": ["getServerSideProps", "getStaticProps", "fetchStatic", "generateProps"], "correcta": "getStaticProps"}
    ],
    "Tailwind CSS": [
        {"pregunta": "¿Qué paradigma sigue Tailwind CSS?", "opciones": ["BEM (Block Element Modifier)", "Utility-first CSS", "OOCSS (Object Oriented CSS)", "CSS in JS"], "correcta": "Utility-first CSS"},
        {"pregunta": "¿Qué clase aplicarías para poner un texto en negrita en Tailwind?", "opciones": ["font-bold", "text-bold", "bold", "fw-bold"], "correcta": "font-bold"},
        {"pregunta": "¿Cómo se compila Tailwind para producción eliminando el CSS no usado?", "opciones": ["Usando PurgeCSS (integrado en su compilador JIT)", "Borrando clases manualmente", "Tailwind no se compila", "Con jQuery"], "correcta": "Usando PurgeCSS (integrado en su compilador JIT)"},
        {"pregunta": "¿Qué hace la clase 'flex' en Tailwind?", "opciones": ["Aplica display: flex;", "Hace el texto flexible", "Añade padding", "Crea un grid"], "correcta": "Aplica display: flex;"},
        {"pregunta": "¿Cómo aplicas un estilo solo para pantallas medianas (md) y superiores?", "opciones": ["@media md { ... }", "md:text-center", "medium-text-center", "screen-md:center"], "correcta": "md:text-center"}
    ],
    "HTML/CSS": [
        {"pregunta": "¿Qué etiqueta HTML se utiliza para definir el contenido principal y central de un documento?", "opciones": ["<main>", "<body>", "<section>", "<article>"], "correcta": "<main>"},
        {"pregunta": "¿Cuál es la forma correcta de enlazar un archivo CSS externo a un documento HTML?", "opciones": ["<style src='estilos.css'>", "<link rel='stylesheet' href='estilos.css'>", "<css file='estilos.css'>", "<script src='estilos.css'>"], "correcta": "<link rel='stylesheet' href='estilos.css'>"},
        {"pregunta": "¿Qué propiedad CSS se utiliza para cambiar el color de fondo de un elemento?", "opciones": ["color", "bg-color", "background-color", "fill"], "correcta": "background-color"},
        {"pregunta": "¿Qué significa el atributo 'alt' en la etiqueta <img>?", "opciones": ["Alternar imagen", "Texto alternativo si la imagen no carga", "Alinear texto", "Alerta de imagen"], "correcta": "Texto alternativo si la imagen no carga"},
        {"pregunta": "¿Qué unidad CSS es relativa al tamaño de fuente del elemento raíz (<html>)?", "opciones": ["em", "px", "rem", "vh"], "correcta": "rem"}
    ],
    "Django": [
        {"pregunta": "¿Qué patrón arquitectónico sigue Django?", "opciones": ["MVC (Model-View-Controller)", "MVT (Model-View-Template)", "MVVM (Model-View-ViewModel)", "Flux"], "correcta": "MVT (Model-View-Template)"},
        {"pregunta": "¿Qué archivo se usa típicamente en Django para definir los modelos de base de datos?", "opciones": ["views.py", "urls.py", "models.py", "admin.py"], "correcta": "models.py"},
        {"pregunta": "¿Cuál es el ORM que utiliza Django por defecto?", "opciones": ["SQLAlchemy", "Peewee", "Django ORM", "Hibernate"], "correcta": "Django ORM"},
        {"pregunta": "¿Qué comando se usa para aplicar migraciones a la base de datos en Django?", "opciones": ["python manage.py migrate", "django-admin sync", "python manage.py make_db", "pip install db"], "correcta": "python manage.py migrate"},
        {"pregunta": "¿Qué característica de Django provee una interfaz lista para administrar registros de la base de datos?", "opciones": ["Django Admin", "Django Dashboard", "Django Manager", "Django CMS"], "correcta": "Django Admin"}
    ],
    "Spring Boot": [
        {"pregunta": "¿Qué anotación se usa para marcar el punto de entrada principal de una aplicación Spring Boot?", "opciones": ["@SpringBootApplication", "@MainClass", "@SpringEntryPoint", "@RestController"], "correcta": "@SpringBootApplication"},
        {"pregunta": "¿Qué servidor web viene incrustado (embedded) por defecto en Spring Boot web?", "opciones": ["Apache HTTPD", "Nginx", "Tomcat", "GlassFish"], "correcta": "Tomcat"},
        {"pregunta": "¿Qué módulo de Spring facilita enormemente el acceso a bases de datos mediante repositorios?", "opciones": ["Spring Security", "Spring Data JPA", "Spring MVC", "Spring Cloud"], "correcta": "Spring Data JPA"},
        {"pregunta": "¿Qué archivo se usa comúnmente para la configuración de propiedades en Spring Boot?", "opciones": ["config.xml", "application.properties o application.yml", "settings.json", ".env"], "correcta": "application.properties o application.yml"},
        {"pregunta": "¿Qué patrón utiliza Spring Core intensivamente para inyectar dependencias?", "opciones": ["Singleton", "Inversión de Control (IoC) / Inyección de Dependencias (DI)", "Factory Method", "Observer"], "correcta": "Inversión de Control (IoC) / Inyección de Dependencias (DI)"}
    ],
    "FastAPI": [
        {"pregunta": "¿En qué lenguaje está escrito y diseñado FastAPI?", "opciones": ["JavaScript", "Python", "Go", "Rust"], "correcta": "Python"},
        {"pregunta": "¿En qué especificación se basa FastAPI para validar datos y generar documentación automática?", "opciones": ["Pydantic y OpenAPI", "Marshmallow y Swagger", "JSON Schema puro", "GraphQL"], "correcta": "Pydantic y OpenAPI"},
        {"pregunta": "¿Qué tipo de concurrencia aprovecha FastAPI masivamente para lograr su alto rendimiento?", "opciones": ["Multithreading con GIL", "Multiprocessing", "Programación asíncrona (async/await)", "WebSockets puros"], "correcta": "Programación asíncrona (async/await)"},
        {"pregunta": "¿Qué servidor ASGI se usa comúnmente para ejecutar FastAPI en producción?", "opciones": ["Gunicorn con Uvicorn", "Apache", "Tomcat", "Nginx solo"], "correcta": "Gunicorn con Uvicorn"},
        {"pregunta": "¿FastAPI genera documentación interactiva (Swagger UI) automáticamente?", "opciones": ["Falso", "Cierto", "Solo si pagas licencia", "Requiere instalar 5 plugins"], "correcta": "Cierto"}
    ],
    "Express": [
        {"pregunta": "¿Sobre qué entorno de ejecución funciona Express.js?", "opciones": ["Navegador Web", "Node.js", "Deno", "PHP"], "correcta": "Node.js"},
        {"pregunta": "¿Qué es un middleware en Express?", "opciones": ["Una base de datos en memoria", "Un servidor proxy", "Una función que tiene acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función middleware", "Un tipo de plantilla HTML"], "correcta": "Una función que tiene acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función middleware"},
        {"pregunta": "¿Cómo se define una ruta GET básica en Express?", "opciones": ["app.get('/', function(req, res) { ... })", "app.route('GET', '/')", "server.getRoute('/')", "router.fetch('/')"], "correcta": "app.get('/', function(req, res) { ... })"},
        {"pregunta": "¿Qué método se usa para enviar una respuesta en formato JSON al cliente?", "opciones": ["res.sendJson()", "res.json()", "res.writeJson()", "res.end()"], "correcta": "res.json()"},
        {"pregunta": "¿Express impone una estructura de carpetas estricta?", "opciones": ["Sí, requiere MVC", "No, es minimalista y sin opinión (unopinionated)", "Solo si usas TypeScript", "Obliga a usar la carpeta /src"], "correcta": "No, es minimalista y sin opinión (unopinionated)"}
    ],
    "NestJS": [
        {"pregunta": "¿Qué arquitectura y estilo de código inspira fuertemente a NestJS?", "opciones": ["Angular (Uso de Decoradores, Módulos, Inyección de Dependencias)", "React", "Vue", "Django"], "correcta": "Angular (Uso de Decoradores, Módulos, Inyección de Dependencias)"},
        {"pregunta": "¿En qué lenguaje está escrito principalmente NestJS y recomienda usar?", "opciones": ["JavaScript puro", "TypeScript", "Python", "C#"], "correcta": "TypeScript"},
        {"pregunta": "¿Qué decorador se usa para definir un controlador en NestJS?", "opciones": ["@Controller()", "@Route()", "@Api()", "@Rest()"], "correcta": "@Controller()"},
        {"pregunta": "¿Qué librerías de servidor HTTP puede usar NestJS por debajo?", "opciones": ["Express (por defecto) o Fastify", "Koa únicamente", "Apache HTTPD", "Ninguna, escribe sus propios sockets"], "correcta": "Express (por defecto) o Fastify"},
        {"pregunta": "¿Qué concepto usa NestJS para validar y transformar datos de entrada en los endpoints?", "opciones": ["Pipes (Tuberías)", "Guards (Guardias)", "Interceptors (Interceptores)", "Middleware"], "correcta": "Pipes (Tuberías)"}
    ],
    "Flask": [
        {"pregunta": "¿Flask es considerado un framework de tipo...?", "opciones": ["Micro-framework", "Full-stack framework", "ORM", "CMS"], "correcta": "Micro-framework"},
        {"pregunta": "¿Qué motor de plantillas incluye Flask por defecto?", "opciones": ["Blade", "Jinja2", "Mako", "EJS"], "correcta": "Jinja2"},
        {"pregunta": "¿Cómo se define una ruta en Flask?", "opciones": ["@app.route('/')", "app.get('/')", "Route::get('/')", "router.add('/')"], "correcta": "@app.route('/')"},
        {"pregunta": "¿Flask incluye un ORM por defecto?", "opciones": ["Sí, SQLAlchemy viene preinstalado y acoplado", "No, debes elegir e instalar uno (como Flask-SQLAlchemy) si lo deseas", "Usa Django ORM", "No soporta bases de datos"], "correcta": "No, debes elegir e instalar uno (como Flask-SQLAlchemy) si lo deseas"},
        {"pregunta": "¿En qué lenguaje está escrito Flask?", "opciones": ["Ruby", "Python", "PHP", "Perl"], "correcta": "Python"}
    ],
    "MySQL": [
        {"pregunta": "¿MySQL es un sistema de gestión de bases de datos de qué tipo?", "opciones": ["NoSQL (Documental)", "Relacional (RDBMS)", "De grafos", "Clave-valor"], "correcta": "Relacional (RDBMS)"},
        {"pregunta": "¿Qué motor de almacenamiento es el estándar moderno y soporta transacciones ACID en MySQL?", "opciones": ["MyISAM", "InnoDB", "Memory", "CSV"], "correcta": "InnoDB"},
        {"pregunta": "¿Qué tipo de dato usarías para almacenar texto de gran longitud (por ejemplo, artículos de un blog)?", "opciones": ["VARCHAR(255)", "CHAR(10)", "TEXT", "INT"], "correcta": "TEXT"},
        {"pregunta": "¿Qué comando SQL elimina por completo una base de datos y todas sus tablas?", "opciones": ["DELETE DATABASE", "DROP DATABASE", "TRUNCATE DATABASE", "REMOVE DATABASE"], "correcta": "DROP DATABASE"},
        {"pregunta": "¿Qué palabra clave se usa para autoincrementar un valor en la clave primaria en MySQL?", "opciones": ["AUTO_INCREMENT", "SERIAL", "IDENTITY", "SEQUENCE"], "correcta": "AUTO_INCREMENT"}
    ],
    "MongoDB": [
        {"pregunta": "¿Qué formato de datos utiliza MongoDB para almacenar documentos internamente?", "opciones": ["XML", "JSON puro", "BSON (Binary JSON)", "YAML"], "correcta": "BSON (Binary JSON)"},
        {"pregunta": "¿A qué familia de bases de datos pertenece MongoDB?", "opciones": ["Relacional", "NoSQL (Documental)", "NoSQL (Grafos)", "Series temporales puras"], "correcta": "NoSQL (Documental)"},
        {"pregunta": "¿Cómo se agrupan los documentos en MongoDB? (Equivalente a una 'Tabla' en SQL)", "opciones": ["Rows", "Collections (Colecciones)", "Tables", "Clusters"], "correcta": "Collections (Colecciones)"},
        {"pregunta": "¿Qué campo se genera automáticamente como identificador único de cada documento si no se provee uno?", "opciones": ["id", "_id", "uuid", "key"], "correcta": "_id"},
        {"pregunta": "¿Qué comando en la shell de MongoDB inserta un nuevo documento?", "opciones": ["db.coleccion.insert() o insertOne()", "INSERT INTO coleccion", "db.coleccion.add()", "coleccion.push()"], "correcta": "db.coleccion.insert() o insertOne()"}
    ],
    "Redis": [
        {"pregunta": "¿Cuál es la característica principal de Redis respecto a su almacenamiento?", "opciones": ["Guarda todo en disco duro mecánico", "Es una base de datos en memoria (In-Memory)", "Es exclusivamente una base de datos de grafos", "Usa SQL estándar"], "correcta": "Es una base de datos en memoria (In-Memory)"},
        {"pregunta": "¿Redis es una base de datos del tipo...?", "opciones": ["Clave-Valor (Key-Value)", "Documental", "Columna Ancha", "Relacional"], "correcta": "Clave-Valor (Key-Value)"},
        {"pregunta": "¿Para qué caso de uso se utiliza Redis con mayor frecuencia en la industria?", "opciones": ["Almacenamiento masivo de videos a largo plazo", "Caché de alta velocidad y manejo de sesiones", "Machine learning", "Motor principal de búsqueda de texto completo complejo"], "correcta": "Caché de alta velocidad y manejo de sesiones"},
        {"pregunta": "¿Qué comando de Redis devuelve el valor asociado a una clave?", "opciones": ["FETCH", "GET", "SELECT", "PULL"], "correcta": "GET"},
        {"pregunta": "¿Redis puede persistir datos en disco (guardar en disco duro)?", "opciones": ["No, todo se pierde al apagar", "Sí, mediante RDB (Snapshots) y AOF (Append Only File)", "Solo si compras Redis Enterprise", "Depende del sistema operativo"], "correcta": "Sí, mediante RDB (Snapshots) y AOF (Append Only File)"}
    ],
    "SQL": [
        {"pregunta": "¿Qué significan las siglas SQL?", "opciones": ["Simple Query Language", "Structured Query Language", "Standard Query Logic", "Systematic Question Language"], "correcta": "Structured Query Language"},
        {"pregunta": "¿Qué cláusula se utiliza para filtrar los resultados después de usar un GROUP BY?", "opciones": ["WHERE", "HAVING", "FILTER", "ORDER BY"], "correcta": "HAVING"},
        {"pregunta": "¿Qué instrucción SQL se usa para modificar datos existentes en una tabla?", "opciones": ["MODIFY", "CHANGE", "UPDATE", "ALTER"], "correcta": "UPDATE"},
        {"pregunta": "¿Cuál es la diferencia entre UNION y UNION ALL?", "opciones": ["UNION ALL elimina duplicados, UNION los mantiene", "UNION elimina duplicados, UNION ALL mantiene todos los registros incluyendo duplicados", "Son idénticos", "UNION es para columnas, UNION ALL para filas"], "correcta": "UNION elimina duplicados, UNION ALL mantiene todos los registros incluyendo duplicados"},
        {"pregunta": "¿Qué operador lógico comprueba si un valor coincide con un patrón específico (ej. nombres que empiezan con 'A')?", "opciones": ["MATCH", "LIKE", "EQUALS", "IN"], "correcta": "LIKE"}
    ],
    "Firebase": [
        {"pregunta": "¿Qué empresa es la propietaria y desarrolladora actual de Firebase?", "opciones": ["Amazon", "Microsoft", "Google", "Facebook"], "correcta": "Google"},
        {"pregunta": "¿Cuál es la base de datos NoSQL insignia más reciente recomendada por Firebase?", "opciones": ["Realtime Database", "Cloud Firestore", "MongoDB", "DynamoDB"], "correcta": "Cloud Firestore"},
        {"pregunta": "¿Qué servicio de Firebase maneja el login y registro de usuarios?", "opciones": ["Firebase Hosting", "Firebase Auth", "Firebase Storage", "Firebase Functions"], "correcta": "Firebase Auth"},
        {"pregunta": "¿Firebase es comúnmente catalogado como un servicio de tipo...?", "opciones": ["IaaS (Infrastructure as a Service)", "BaaS (Backend as a Service)", "SaaS (Software as a Service)", "On-Premise"], "correcta": "BaaS (Backend as a Service)"},
        {"pregunta": "¿Cloud Firestore actualiza los datos en los clientes conectados en tiempo real?", "opciones": ["Sí, mediante listeners (onSnapshot)", "No, hay que hacer peticiones REST manuales", "Solo en aplicaciones Android", "Requiere usar WebSockets puros sin SDK"], "correcta": "Sí, mediante listeners (onSnapshot)"}
    ],
    "Supabase": [
        {"pregunta": "¿Cómo se promociona Supabase comúnmente en la comunidad de desarrolladores?", "opciones": ["Una alternativa open-source a Firebase", "Un motor de videojuegos", "Un framework Frontend", "Un clon de AWS"], "correcta": "Una alternativa open-source a Firebase"},
        {"pregunta": "¿Qué base de datos relacional utiliza Supabase por debajo (su núcleo)?", "opciones": ["MySQL", "PostgreSQL", "SQLite", "Oracle"], "correcta": "PostgreSQL"},
        {"pregunta": "¿Supabase permite crear APIs automáticamente a partir del esquema de la base de datos?", "opciones": ["Sí, usando PostgREST", "No, debes escribir el backend en Node.js obligatoriamente", "Solo en planes de pago", "No tiene API"], "correcta": "Sí, usando PostgREST"},
        {"pregunta": "¿Supabase ofrece soporte para suscripciones en tiempo real (Realtime)?", "opciones": ["No, al usar SQL no se puede", "Sí, capta los cambios de la base de datos y los envía vía WebSockets", "Solo para chats", "Aún está en desarrollo (Beta privada)"], "correcta": "Sí, capta los cambios de la base de datos y los envía vía WebSockets"},
        {"pregunta": "¿Supabase Auth soporta Row Level Security (RLS) para proteger los datos a nivel de fila?", "opciones": ["Falso", "Cierto", "Requiere Firebase Auth", "RLS no existe en SQL"], "correcta": "Cierto"}
    ],
    "Prisma": [
        {"pregunta": "¿Qué es Prisma en el ecosistema Node.js / TypeScript?", "opciones": ["Un framework CSS", "Un ORM (Object-Relational Mapper) moderno y tipado", "Un servidor HTTP", "Un motor de plantillas HTML"], "correcta": "Un ORM (Object-Relational Mapper) moderno y tipado"},
        {"pregunta": "¿Cómo se define el esquema de la base de datos en Prisma?", "opciones": ["En archivos SQL crudos", "Usando clases decoradas con @Entity", "En un archivo declarativo llamado schema.prisma", "En un JSON"], "correcta": "En un archivo declarativo llamado schema.prisma"},
        {"pregunta": "¿Qué herramienta de Prisma permite explorar y editar los datos de la base de datos mediante una interfaz visual en el navegador?", "opciones": ["Prisma Client", "Prisma Migrate", "Prisma Studio", "Prisma Admin"], "correcta": "Prisma Studio"},
        {"pregunta": "¿Prisma genera un cliente de base de datos fuertemente tipado (Type-safe) para TypeScript?", "opciones": ["Sí, a partir del schema.prisma", "No, usa tipos 'any'", "Solo para MongoDB", "Requiere tipado manual"], "correcta": "Sí, a partir del schema.prisma"},
        {"pregunta": "¿Prisma soporta bases de datos NoSQL?", "opciones": ["No, solo SQL", "Sí, soporta MongoDB", "Solo Firebase", "Prisma es una BD en sí misma"], "correcta": "Sí, soporta MongoDB"}
    ],
    "Kubernetes": [
        {"pregunta": "¿Qué es Kubernetes (K8s)?", "opciones": ["Un sistema operativo de servidor", "Un orquestador de contenedores para automatizar el despliegue, escalado y manejo de aplicaciones", "Una base de datos de red", "Una versión de Docker"], "correcta": "Un orquestador de contenedores para automatizar el despliegue, escalado y manejo de aplicaciones"},
        {"pregunta": "¿Cuál es la unidad de despliegue más pequeña y básica en Kubernetes?", "opciones": ["El Contenedor (Container)", "El Pod", "El Nodo (Node)", "El Cluster"], "correcta": "El Pod"},
        {"pregunta": "¿Qué herramienta de línea de comandos es la oficial para interactuar con un clúster de Kubernetes?", "opciones": ["kubectl", "k8s-cli", "kube-admin", "docker-compose"], "correcta": "kubectl"},
        {"pregunta": "¿Qué componente de Kubernetes se encarga de asignar un Pod a un Nodo específico basándose en los recursos requeridos?", "opciones": ["Kubelet", "Kube-proxy", "Kube-scheduler", "Etcd"], "correcta": "Kube-scheduler"},
        {"pregunta": "¿Qué recurso de Kubernetes asegura que un número específico de réplicas de un Pod estén siempre ejecutándose?", "opciones": ["Deployment / ReplicaSet", "Service", "Ingress", "ConfigMap"], "correcta": "Deployment / ReplicaSet"}
    ],
    "AWS": [
        {"pregunta": "¿Qué significa AWS?", "opciones": ["Amazon Web Systems", "Amazon Web Services", "Automated Web Server", "Amazon Wireless Services"], "correcta": "Amazon Web Services"},
        {"pregunta": "¿Cuál es el servicio de almacenamiento de objetos (Object Storage) más famoso de AWS?", "opciones": ["EC2", "RDS", "Amazon S3", "DynamoDB"], "correcta": "Amazon S3"},
        {"pregunta": "¿Qué servicio de AWS provee capacidad de cómputo redimensionable en la nube (Máquinas Virtuales)?", "opciones": ["AWS Lambda", "Amazon EC2", "Amazon VPC", "AWS Route 53"], "correcta": "Amazon EC2"},
        {"pregunta": "¿Cuál es el servicio de computación 'Serverless' (sin servidor) de AWS donde ejecutas código por evento?", "opciones": ["AWS Elastic Beanstalk", "AWS Lambda", "Amazon ECS", "AWS Fargate"], "correcta": "AWS Lambda"},
        {"pregunta": "¿Qué servicio utilizarías para gestionar bases de datos relacionales administradas (MySQL, Postgres, etc.) en AWS?", "opciones": ["DynamoDB", "Amazon Redshift", "Amazon RDS", "Amazon S3"], "correcta": "Amazon RDS"}
    ],
    "GCP": [
        {"pregunta": "¿A qué empresa pertenece GCP?", "opciones": ["Google (Google Cloud Platform)", "Global Cloud Providers", "Microsoft", "IBM"], "correcta": "Google (Google Cloud Platform)"},
        {"pregunta": "¿Cuál es el servicio de base de datos NoSQL de documentos altamente escalable de GCP (evolución de Datastore)?", "opciones": ["Cloud SQL", "Cloud Spanner", "Firestore", "BigQuery"], "correcta": "Firestore"},
        {"pregunta": "¿Qué servicio de GCP es un almacén de datos (Data Warehouse) empresarial totalmente administrado para análisis masivo?", "opciones": ["Cloud Storage", "BigQuery", "Compute Engine", "Cloud Run"], "correcta": "BigQuery"},
        {"pregunta": "¿Qué producto de GCP te permite ejecutar contenedores sin estado (Serverless) de manera sencilla y escalable?", "opciones": ["Cloud Run", "App Engine", "Compute Engine", "Anthos"], "correcta": "Cloud Run"},
        {"pregunta": "¿Cuál es el equivalente de Amazon S3 (almacenamiento de objetos) en GCP?", "opciones": ["Google Drive", "Cloud Storage", "Persistent Disk", "Cloud SQL"], "correcta": "Cloud Storage"}
    ],
    "CI/CD": [
        {"pregunta": "¿Qué significan las siglas CI/CD?", "opciones": ["Continuous Integration / Continuous Deployment (o Delivery)", "Code Inspection / Code Delivery", "Cloud Integration / Cloud Deployment", "Computer Interface / Computer Design"], "correcta": "Continuous Integration / Continuous Deployment (o Delivery)"},
        {"pregunta": "¿Cuál es el objetivo principal de la Integración Continua (CI)?", "opciones": ["Desplegar en producción el viernes por la noche", "Automatizar la integración de código de varios desarrolladores en un repositorio compartido, corriendo pruebas frecuentemente", "Minificar archivos CSS y JS", "Escribir código más rápido"], "correcta": "Automatizar la integración de código de varios desarrolladores en un repositorio compartido, corriendo pruebas frecuentemente"},
        {"pregunta": "¿Qué herramienta es extremadamente popular para definir pipelines de CI/CD directamente en GitHub?", "opciones": ["Jenkins", "GitLab CI", "GitHub Actions", "Travis CI"], "correcta": "GitHub Actions"},
        {"pregunta": "¿Cuál es la diferencia principal entre Continuous Delivery y Continuous Deployment?", "opciones": ["Son sinónimos exactos", "Delivery requiere aprobación manual para ir a producción; Deployment va a producción de forma 100% automática", "Delivery es para móviles, Deployment para web", "Delivery usa Docker, Deployment usa Máquinas Virtuales"], "correcta": "Delivery requiere aprobación manual para ir a producción; Deployment va a producción de forma 100% automática"},
        {"pregunta": "¿Qué práctica es esencial para que CI/CD funcione con confianza y no rompa producción?", "opciones": ["Tener un conjunto sólido de pruebas automatizadas (Unit/Integration Tests)", "Usar siempre el lenguaje más nuevo", "Programar en solitario", "Evitar el uso de bases de datos"], "correcta": "Tener un conjunto sólido de pruebas automatizadas (Unit/Integration Tests)"}
    ],
    "Git": [
        {"pregunta": "¿Qué comando de Git se usa para subir los commits locales a un repositorio remoto?", "opciones": ["git pull", "git commit", "git push", "git upload"], "correcta": "git push"},
        {"pregunta": "¿Qué comando usarías para ver el historial de commits?", "opciones": ["git status", "git log", "git history", "git show"], "correcta": "git log"},
        {"pregunta": "¿Qué hace el comando 'git clone'?", "opciones": ["Crea una rama idéntica a la actual", "Descarga una copia completa de un repositorio remoto en tu máquina local", "Clona el último commit", "Elimina un repositorio"], "correcta": "Descarga una copia completa de un repositorio remoto en tu máquina local"},
        {"pregunta": "¿Qué comando añade todos los archivos modificados y nuevos al área de preparación (staging area)?", "opciones": ["git add .", "git commit -a", "git stage all", "git push ."], "correcta": "git add ."},
        {"pregunta": "¿Cómo resuelves típicamente un conflicto de 'merge' (fusión)?", "opciones": ["Borrando tu rama y clonando de nuevo", "Git los resuelve siempre automáticamente", "Editando manualmente los archivos en conflicto, guardando y haciendo commit", "Formateando el disco"], "correcta": "Editando manualmente los archivos en conflicto, guardando y haciendo commit"}
    ],
    "Linux": [
        {"pregunta": "¿Qué comando de Linux muestra tu ubicación actual en el sistema de archivos (ruta absoluta)?", "opciones": ["ls", "cd", "pwd", "dir"], "correcta": "pwd"},
        {"pregunta": "¿Qué hace el comando 'chmod'?", "opciones": ["Cambia el propietario de un archivo", "Cambia los permisos (lectura, escritura, ejecución) de un archivo o directorio", "Modifica la contraseña del usuario", "Mueve un archivo"], "correcta": "Cambia los permisos (lectura, escritura, ejecución) de un archivo o directorio"},
        {"pregunta": "¿Qué símbolo se usa en la consola para redirigir la salida de un comando a un archivo, sobrescribiéndolo?", "opciones": ["|", ">>", ">", "<"], "correcta": ">"},
        {"pregunta": "¿Qué herramienta de línea de comandos de Linux se usa a menudo para hacer peticiones HTTP?", "opciones": ["ping", "netstat", "curl", "ssh"], "correcta": "curl"},
        {"pregunta": "¿Qué comando te permite ejecutar instrucciones con privilegios de superusuario (administrador)?", "opciones": ["admin", "root", "su-run", "sudo"], "correcta": "sudo"}
    ]
}

# Read existing file to inject safely
with open(banco_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We will just rewrite the whole file because Python dictionary to TS string is easy
import json

# Let's extract the existing ones by importing if we could, but it's simpler to just output the full file
# from scratch so we don't mess up brackets. Wait, I can extract the existing string and insert before the last closing brace.
# Find the last closing brace
last_brace_idx = content.rfind('}')

# Prepare the new TS content to inject
injection = ""
for tech, questions in new_questions.items():
    injection += f'  "{tech}": [\n'
    for idx, q in enumerate(questions):
        # Format the question properly
        q_str = json.dumps(q, ensure_ascii=False)
        injection += f"    {q_str}"
        if idx < len(questions) - 1:
            injection += ",\n"
        else:
            injection += "\n"
    injection += "  ],\n"

# Clean up trailing comma on the last item if needed
if injection.endswith(',\n'):
    injection = injection[:-2] + '\n'

final_content = content[:last_brace_idx].rstrip()
if final_content.endswith(','):
    final_content += '\n'
else:
    final_content += ',\n'

final_content += injection + "\n};\n"

with open(banco_path, 'w', encoding='utf-8') as f:
    f.write(final_content)

print(f"Added {len(new_questions)} new technologies to bancoPreguntas.ts!")
