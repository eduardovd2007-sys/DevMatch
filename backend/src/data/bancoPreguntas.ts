export const bancoDePreguntas: Record<string, any[]> = {
  // === LENGUAJES ===
  "JavaScript": [
    { pregunta: "¿Qué imprimirá el siguiente código en consola?", codigo: "console.log(typeof null);\nconsole.log(typeof undefined);", opciones: ["'null' y 'undefined'", "'object' y 'undefined'", "'object' y 'object'", "'undefined' y 'null'"], correcta: "'object' y 'undefined'" },
    { pregunta: "¿Qué es un closure en JavaScript?", opciones: ["Un tipo de variable", "Una función con acceso a su ámbito léxico", "Un error de sintaxis", "Una clase base"], correcta: "Una función con acceso a su ámbito léxico" },
    { pregunta: "¿Cuál es el resultado de la siguiente ejecución?", codigo: "const arr = [1, 2, 3];\narr[10] = 99;\nconsole.log(arr.length);", opciones: ["3", "11", "Error", "4"], correcta: "11" },
    { pregunta: "¿Qué es el Event Loop?", opciones: ["Un ciclo for infinito", "El modelo de concurrencia de JS", "Una función matemática", "Un plugin de Node"], correcta: "El modelo de concurrencia de JS" },
    { pregunta: "¿Qué imprimirá esto?", codigo: "let x = 1;\nif (true) {\n  let x = 2;\n}\nconsole.log(x);", opciones: ["1", "2", "undefined", "Error"], correcta: "1" }
  ],
  "C++": [
    { pregunta: "¿Qué imprimirá el siguiente código?", codigo: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int x = 5;\n  int *p = &x;\n  cout << *p;\n  return 0;\n}", opciones: ["La dirección de memoria", "5", "Error de compilación", "0"], correcta: "5" },
    { pregunta: "¿Cómo se llama el proceso de liberar memoria asignada dinámicamente?", opciones: ["delete", "remove", "free", "clear"], correcta: "delete" },
    { pregunta: "¿Qué problema tiene el siguiente código?", codigo: "int* ptr = new int[10];\n// ... operaciones ...\ndelete ptr;", opciones: ["Ninguno", "Falta include", "Se debe usar delete[] ptr;", "La sintaxis new int[10] es incorrecta"], correcta: "Se debe usar delete[] ptr;" },
    { pregunta: "¿Qué es un constructor?", opciones: ["Una función para construir la interfaz", "Un método especial que se llama al crear un objeto", "Un puntero a otra clase", "Un operador aritmético"], correcta: "Un método especial que se llama al crear un objeto" },
    { pregunta: "¿Cuál es el resultado de la siguiente operación de bits?", codigo: "int a = 5; // 0101\nint b = 3; // 0011\ncout << (a & b);", opciones: ["1", "8", "7", "0"], correcta: "1" }
  ],
  "TypeScript": [
    { pregunta: "¿Qué añade TypeScript a JavaScript?", opciones: ["Tipado estático", "Clases dinámicas", "Nuevas funciones matemáticas", "Soporte nativo para CSS"], correcta: "Tipado estático" },
    { pregunta: "¿Qué error arrojará el siguiente código en tiempo de compilación?", codigo: "interface User {\n  id: number;\n  name: string;\n}\n\nconst u: User = { id: 1 };", opciones: ["Ninguno", "Property 'name' is missing", "Type 'number' is not assignable to 'string'", "Invalid JSON"], correcta: "Property 'name' is missing" },
    { pregunta: "¿Qué palabra clave se usa para crear un alias de tipo?", opciones: ["interface", "type", "alias", "class"], correcta: "type" },
    { pregunta: "¿Qué imprimirá este código (asumiendo que se transpile sin errores estrictos)?", codigo: "enum Color { Red = 1, Green, Blue }\nconsole.log(Color.Green);", opciones: ["1", "2", "Green", "0"], correcta: "2" },
    { pregunta: "¿Cómo se define una variable de solo lectura en una interfaz?", opciones: ["readonly", "const", "static", "final"], correcta: "readonly" }
  ],
  "Python": [
    { pregunta: "¿Cuál es el resultado del siguiente código?", codigo: "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)", opciones: ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "None"], correcta: "[1, 2, 3, 4]" },
    { pregunta: "¿Qué palabra clave se usa para definir una función en Python?", opciones: ["func", "def", "function", "lambda"], correcta: "def" },
    { pregunta: "¿Qué imprimirá el siguiente código?", codigo: "def foo(a, b=[]):\n    b.append(a)\n    return b\n\nprint(foo(1))\nprint(foo(2))", opciones: ["[1] y [2]", "[1] y [1, 2]", "Error de sintaxis", "None"], correcta: "[1] y [1, 2]" },
    { pregunta: "¿Qué decorador se usa comúnmente para métodos de clase?", opciones: ["@staticmethod", "@classmethod", "@property", "Todas las anteriores"], correcta: "Todas las anteriores" },
    { pregunta: "¿Qué función se usa para obtener la longitud de una lista?", opciones: ["length()", "size()", "len()", "count()"], correcta: "len()" }
  ],

  // === FRONTEND ===
  "Svelte": [
    { pregunta: "¿Cuál es la mayor diferencia de Svelte respecto a React/Vue?", opciones: ["No usa Virtual DOM, compila el código en build-time", "Es 100% backend", "Usa jQuery por debajo", "No soporta TypeScript"], correcta: "No usa Virtual DOM, compila el código en build-time" },
    { pregunta: "¿Qué hace la siguiente línea reactiva en Svelte?", codigo: "<script>\n  let count = 0;\n  $: doubled = count * 2;\n</script>", opciones: ["Crea un error de sintaxis", "Calcula 'doubled' automáticamente cada vez que 'count' cambia", "Define una variable estática", "Llama a jQuery"], correcta: "Calcula 'doubled' automáticamente cada vez que 'count' cambia" },
    { pregunta: "¿Cómo pasas un prop a un componente hijo en Svelte?", codigo: "<script>\n  // ¿Qué debes poner aquí para recibir 'name'?\n  export let name;\n</script>", opciones: ["import { name }", "export let name;", "const name = props.name;", "$props.name"], correcta: "export let name;" },
    { pregunta: "¿Cómo se llama el framework full-stack basado en Svelte?", opciones: ["SvelteKit", "NextSvelte", "Nuxt", "SvelteServer"], correcta: "SvelteKit" },
    { pregunta: "¿En qué formato/extensión se guardan los componentes de Svelte?", opciones: [".jsx", ".vue", ".svelte", ".js"], correcta: ".svelte" }
  ],
  "React": [
    { pregunta: "¿Qué hook se usa para manejar el estado en un componente funcional?", opciones: ["useEffect", "useState", "useContext", "useReducer"], correcta: "useState" },
    { pregunta: "¿Qué imprimirá este componente al montarse?", codigo: "function App() {\n  const [count, setCount] = useState(0);\n  \n  useEffect(() => {\n    setCount(count + 1);\n    setCount(count + 1);\n  }, []);\n\n  return <div>{count}</div>;\n}", opciones: ["0", "1", "2", "Bucle infinito"], correcta: "1" },
    { pregunta: "¿Cómo se pasan datos de un componente padre a un hijo?", opciones: ["Por State", "Por Props", "Por Contexto global", "Por Redux"], correcta: "Por Props" },
    { pregunta: "¿Qué error hay en el siguiente código?", codigo: "function List() {\n  const items = ['A', 'B'];\n  return items.map(item => <div>{item}</div>);\n}", opciones: ["Falta el atributo 'key' en el div", "Falta el return dentro del map", "items.map no es una función", "Ninguno"], correcta: "Falta el atributo 'key' en el div" },
    { pregunta: "¿Qué significa JSX?", opciones: ["JavaScript XML", "Java Syntax Extension", "JSON X", "JavaScript Xtreme"], correcta: "JavaScript XML" }
  ],

  // === BACKEND ===
  "Laravel": [
    { pregunta: "¿Qué retornará este código en Laravel usando Eloquent?", codigo: "$user = User::where('email', 'test@test.com')->first();\nreturn $user->name;", opciones: ["El nombre del usuario o error si no existe", "Un array JSON", "Un objeto de conexión SQL", "Un booleano"], correcta: "El nombre del usuario o error si no existe" },
    { pregunta: "¿Cómo se llama el motor de plantillas por defecto en Laravel?", opciones: ["Twig", "Blade", "Smarty", "EJS"], correcta: "Blade" },
    { pregunta: "¿Qué hace la siguiente ruta?", codigo: "Route::get('/users/{id}', [UserController::class, 'show']);", opciones: ["Guarda un usuario", "Abre la vista de usuarios", "Asigna el ID a la función show del controlador", "Elimina el usuario por ID"], correcta: "Asigna el ID a la función show del controlador" },
    { pregunta: "¿Qué herramienta CLI se usa para generar controladores, modelos y migraciones en Laravel?", opciones: ["composer", "artisan", "npm", "laravel-cli"], correcta: "artisan" },
    { pregunta: "¿Qué comando inicia el servidor de desarrollo en Laravel?", opciones: ["php artisan serve", "php start", "laravel run", "npm start"], correcta: "php artisan serve" }
  ],
  "Node.js": [
    { pregunta: "¿Qué motor de JavaScript utiliza Node.js por debajo?", opciones: ["SpiderMonkey", "V8", "Chakra", "JavaScriptCore"], correcta: "V8" },
    { pregunta: "¿Qué hace este código de Express?", codigo: "app.get('/api', (req, res) => {\n  res.json({ ok: true });\n});", opciones: ["Devuelve HTML", "Devuelve una respuesta JSON 200 al hacer un GET", "Cierra el servidor", "Redirige a /api"], correcta: "Devuelve una respuesta JSON 200 al hacer un GET" },
    { pregunta: "¿Qué objeto global se usa para acceder a las variables de entorno en Node?", opciones: ["window.env", "document.env", "process.env", "global.env"], correcta: "process.env" },
    { pregunta: "¿Qué módulo nativo se usa para leer archivos?", codigo: "const fs = require('fs');\nconst data = fs.readFileSync('archivo.txt');", opciones: ["http", "path", "fs", "crypto"], correcta: "fs" },
    { pregunta: "¿Qué gestor de paquetes viene por defecto al instalar Node.js?", opciones: ["yarn", "pnpm", "npm", "bower"], correcta: "npm" }
  ],

  // === BASES DE DATOS ===
  "SQLite": [
    { pregunta: "¿Qué diferencia a SQLite de otras BD relacionales como MySQL o Postgres?", opciones: ["No usa SQL", "No tiene tipos de datos", "Es una base de datos embebida (un solo archivo), sin servidor separado", "Solo funciona en Linux"], correcta: "Es una base de datos embebida (un solo archivo), sin servidor separado" },
    { pregunta: "¿Qué hará esta consulta en SQLite?", codigo: "CREATE TABLE IF NOT EXISTS users (\n  id INTEGER PRIMARY KEY AUTOINCREMENT,\n  name TEXT NOT NULL\n);", opciones: ["Borrar la tabla users", "Crear la tabla users solo si no existe ya", "Lanzar un error por sintaxis", "Crear una base de datos"], correcta: "Crear la tabla users solo si no existe ya" },
    { pregunta: "¿Qué tipo de dato NO es una clase de almacenamiento estándar en SQLite?", opciones: ["NULL", "INTEGER", "TEXT", "BOOLEAN"], correcta: "BOOLEAN" },
    { pregunta: "¿Qué pasará al ejecutar esto si name espera un texto?", codigo: "INSERT INTO users (name) VALUES (12345);", opciones: ["Error tipo mismatch", "Lo inserta pero convertido a texto (Type Affinity)", "Crasha la DB", "Ignora la inserción"], correcta: "Lo inserta pero convertido a texto (Type Affinity)" },
    { pregunta: "¿En qué entorno se usa muchísimo SQLite?", opciones: ["Clusters de Big Data", "Aplicaciones móviles (iOS/Android)", "Servidores de alta concurrencia mundial", "Inteligencia Artificial"], correcta: "Aplicaciones móviles (iOS/Android)" }
  ],
  "PostgreSQL": [
    { pregunta: "¿Qué tipo de JOIN devuelve todas las filas de la tabla izquierda y las coincidencias de la derecha?", opciones: ["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"], correcta: "LEFT JOIN" },
    { pregunta: "¿Qué retornará este query?", codigo: "SELECT COALESCE(NULL, 'A', 'B');", opciones: ["NULL", "A", "B", "Error"], correcta: "A" },
    { pregunta: "¿Cuál de estos tipos de datos soporta PostgreSQL nativamente que no está en todas las SQL clásicas?", opciones: ["VARCHAR", "INT", "JSONB", "DATE"], correcta: "JSONB" },
    { pregunta: "¿Qué significa la cláusula RETURNING en un INSERT?", codigo: "INSERT INTO users (name) VALUES ('Juan') RETURNING id;", opciones: ["No hace nada", "Cancela la inserción", "Devuelve el ID generado de la fila insertada", "Borra el usuario anterior"], correcta: "Devuelve el ID generado de la fila insertada" },
    { pregunta: "¿Cuál es el puerto por defecto de PostgreSQL?", opciones: ["3306", "5432", "27017", "6379"], correcta: "5432" }
  ],

  // === DEVOPS / CLOUD ===
  "Azure": [
    { pregunta: "¿Qué empresa desarrolla Azure?", opciones: ["Oracle", "Google", "Microsoft", "Amazon"], correcta: "Microsoft" },
    { pregunta: "¿Qué define este bloque de código en un pipeline de Azure DevOps (YAML)?", codigo: "trigger:\n- main\n\npool:\n  vmImage: ubuntu-latest\n\nsteps:\n- script: npm run build", opciones: ["Crea una máquina virtual permanente", "Ejecuta un script de construcción automáticamente cuando hay push a 'main'", "Borra la rama main", "Instala ubuntu localmente"], correcta: "Ejecuta un script de construcción automáticamente cuando hay push a 'main'" },
    { pregunta: "¿Cuál es la base de datos NoSQL globalmente distribuida insignia de Azure?", opciones: ["Azure SQL", "Cosmos DB", "Blob Storage", "Table Storage"], correcta: "Cosmos DB" },
    { pregunta: "¿Cómo se llama el servicio de funciones Serverless de Azure?", opciones: ["Azure Serverless", "Azure Functions", "Azure Lambda", "Azure Run"], correcta: "Azure Functions" },
    { pregunta: "¿Qué herramienta CLI se usa para administrar Azure?", opciones: ["azure-cli (az)", "ms-cli", "gcloud", "aws"], correcta: "azure-cli (az)" }
  ],
  "Docker": [
    { pregunta: "¿Qué es Docker?", opciones: ["Una máquina virtual completa", "Una plataforma para crear, desplegar y ejecutar contenedores", "Un proveedor de nube", "Un sistema operativo"], correcta: "Una plataforma para crear, desplegar y ejecutar contenedores" },
    { pregunta: "¿Qué hace esta línea en un Dockerfile?", codigo: "COPY package*.json ./\nRUN npm install", opciones: ["Borra todos los paquetes", "Copia el package.json y luego instala las dependencias", "Copia la carpeta entera", "Ejecuta el servidor"], correcta: "Copia el package.json y luego instala las dependencias" },
    { pregunta: "¿Qué herramienta se usa para definir y correr aplicaciones Docker multi-contenedor?", opciones: ["Docker Machine", "Docker Compose", "Docker Swarm", "Kubernetes"], correcta: "Docker Compose" },
    { pregunta: "¿Qué significa el comando 'EXPOSE 3000' en un Dockerfile?", codigo: "FROM node:18\nEXPOSE 3000", opciones: ["Abre puertos en el router", "Declara que el contenedor escucha en el puerto 3000", "Detiene el puerto 3000", "No es un comando válido"], correcta: "Declara que el contenedor escucha en el puerto 3000" },
    { pregunta: "¿Qué es un 'Volumen' en Docker?", opciones: ["La memoria RAM asignada", "Un mecanismo para persistir datos generados por el contenedor", "El tamaño de la imagen", "El nivel sonoro de la alerta"], correcta: "Un mecanismo para persistir datos generados por el contenedor" }
  ],
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

};
