/**
 * JavaPedia — Spanish Content (Sections 1-5) - DEEP DIVE
 */
const CONTENT_ES_01 = [
    {
        id: 'intro', num: '01', title: 'Introducción a Java y Arquitectura Interna',
        body: `
<h2>¿Qué es Java?</h2>
<p>Java es un lenguaje de programación <strong>orientado a objetos</strong>, de tipado estático y fuertemente tipado, creado originalmente por <em>James Gosling</em> y su equipo ("The Green Team") en Sun Microsystems en 1995. Inicialmente llamado <em>Oak</em>, fue diseñado para la televisión interactiva antes de pivotar hacia la World Wide Web. Su filosofía central es <strong>"Write Once, Run Anywhere"</strong> (WORA), lo que significa que el código, una vez compilado, puede ejecutarse sin modificaciones en cualquier dispositivo o sistema operativo que posea una implementación de la Máquina Virtual de Java (JVM).</p>

<h2>La Tripleta Arquitectónica: JDK, JRE y JVM</h2>

<h3>1. JDK (Java Development Kit)</h3>
<p>Es el kit completo de herramientas para el <strong>desarrollador</strong>. Además de incluir el entorno de ejecución (JRE), proporciona:</p>
<ul>
    <li><code>javac</code>: El compilador que traduce el código fuente (<code>.java</code>) a bytecode (<code>.class</code>).</li>
    <li><code>javadoc</code>: Generador automático de documentación API a partir de comentarios en el código.</li>
    <li><code>jdb</code> (Java Debugger): Herramienta de depuración en línea de comandos.</li>
    <li><code>jps</code>, <code>jstat</code>, <code>jmap</code>: Herramientas de monitoreo y perfilado de rendimiento.</li>
</ul>

<h3>2. JRE (Java Runtime Environment)</h3>
<p>Es el entorno de ejecución mínimo necesario para <strong>correr</strong> una aplicación Java precompilada. Contiene:</p>
<ul>
    <li>La Máquina Virtual de Java (JVM).</li>
    <li>Las bibliotecas del núcleo de Java (Java Class Library - JCL) como <code>java.lang</code>, <code>java.util</code>, <code>java.io</code>, etc.</li>
    <li>Archivos de configuración y propiedades del entorno.</li>
</ul>
<div class="callout callout-info"><div class="callout-title"><i class="fas fa-info-circle"></i> Nota sobre Java 11+</div>A partir de Java 11, Oracle dejó de distribuir el JRE de forma separada al JDK. Ahora se prefiere crear entornos de ejecución modulares y a medida utilizando la herramienta <code>jlink</code>.</div>

<h3>3. JVM (Java Virtual Machine) — Deep Dive</h3>
<p>La JVM es el corazón lógico de Java. No es un hardware físico, sino una abstracción de máquina que interpreta y ejecuta el <em>bytecode</em>. Su arquitectura interna consta de tres subsistemas principales:</p>

<h4>A. Class Loader Subsystem (Subsistema Cargador de Clases)</h4>
<p>Responsable de cargar dinámicamente las clases a memoria en tiempo de ejecución. Sigue un modelo de delegación jerárquico:</p>
<ol>
    <li><strong>Bootstrap ClassLoader:</strong> Carga las clases nativas fundamentales de la JRE (del archivo <code>rt.jar</code> en Java 8 y anteriores, o de los módulos base en Java 9+). Está escrito en código nativo (C++).</li>
    <li><strong>Extension ClassLoader:</strong> Carga las clases de extensión (librerías ubicadas en la carpeta <code>jre/lib/ext</code>).</li>
    <li><strong>Application/System ClassLoader:</strong> Carga las clases a nivel de aplicación especificadas en la variable de entorno <code>CLASSPATH</code>.</li>
</ol>

<h4>B. Runtime Data Areas (Áreas de Memoria en Tiempo de Ejecución)</h4>
<p>La JVM reserva distintos espacios de memoria gestionados por el sistema operativo:</p>
<ul>
    <li><strong>Method Area (Metaspace en Java 8+):</strong> Almacena estructuras estructuradas por clase, como el pool de constantes de ejecución (Runtime Constant Pool), nombres de interfaces, campos, métodos y el código de los constructores. Es memoria compartida por todos los hilos. <em>En Java 8+, se eliminó el "PermGen" y se reemplazó por el "Metaspace", que utiliza memoria nativa del OS para evitar errores de OutOfMemoryError.</em></li>
    <li><strong>Heap (Montículo):</strong> Es el área principal de memoria compartida donde se asignan todos los objetos y arrays. El recolector de basura (Garbage Collector) opera principalmente en esta área para limpiar objetos sin referencias.</li>
    <li><strong>Stack (Pila):</strong> Cada hilo de ejecución (Thread) tiene su propio stack privado. Almacena <em>frames</em> (marcos). Cada vez que se llama a un método, se crea un nuevo frame que guarda variables locales y resultados parciales, y participa en el retorno de métodos y el despacho de excepciones. Dado que cada hilo tiene el suyo propio, es inherentemente Thread-Safe para variables locales (primitivos y referencias).</li>
    <li><strong>PC Register (Program Counter):</strong> Cada hilo tiene su PC Register, que contiene la dirección de memoria física de la instrucción de la JVM que se está ejecutando en ese momento exacto.</li>
    <li><strong>Native Method Stack:</strong> Almacena el estado de los métodos nativos (escritos en C, C++, etc.) invocados a través de JNI (Java Native Interface).</li>
</ul>

<h4>C. Execution Engine (Motor de Ejecución)</h4>
<p>El motor que realmente ejecuta el bytecode cargado en memoria:</p>
<ul>
    <li><strong>Intérprete:</strong> Lee el bytecode de forma secuencial y lo ejecuta. Es rápido de iniciar pero lento en ejecución repetitiva porque cada instrucción debe interpretarse cada vez.</li>
    <li><strong>JIT Compiler (Just-In-Time Compiler):</strong> Para contrarrestar la lentitud del intérprete, la JVM utiliza el JIT. Monitorea el bytecode que se ejecuta repetidamente (los llamados <em>"hot spots"</em>). Cuando identifica un método o bucle muy frecuentado, el JIT compila ese bytecode específico directamente a código máquina nativo y lo almacena en caché. La próxima vez, ejecuta el código nativo ultrarrápido sin interpretar.</li>
    <li><strong>Garbage Collector (GC):</strong> Algoritmo demonio en segundo plano que libera memoria reclamando el espacio de objetos que ya no tienen referencias activas en el programa. Algoritmos modernos incluyen G1GC (Garbage First) y ZGC (Z Garbage Collector, pausa de latencia &lt; 1ms).</li>
</ul>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Desmitificando el "Hola Mundo"
public class HolaMundo {
    // 'public' (Modificador de acceso: visible en cualquier lugar por la JVM)
    // 'static' (El método pertenece a la clase, no requiere instanciación para ser invocado)
    // 'void'   (No devuelve ningún valor de retorno)
    // 'main'   (El punto de entrada estandarizado que busca la JVM)
    // 'String[] args' (Parámetros pasados desde la línea de comandos)
    public static void main(String[] args) {
        // 'System' es una clase final en java.lang
        // 'out' es una variable estática del tipo PrintStream
        // 'println' es un método sobrecargado de PrintStream
        System.out.println("¡Hola, Mundo desde los internals!");
    }
}</code></pre></div>
`
    },
    {
        id: 'syntax', num: '02', title: 'Sintaxis Básica y Tipado (Memory Model)',
        body: `
<h2>Tipado Estático y Seguro</h2>
<p>Java es de <strong>tipado estático</strong> y <strong>fuertemente tipado</strong>. Esto disminuye los errores en tiempo de ejecución al forzar comprobaciones rigurosas en tiempo de compilación. No puedes asignar un 'String' a un 'int' sin una conversión explícita o análisis.</p>

<h2>Tipos Primitivos y Modelo de Memoria</h2>
<p>Los tipos primitivos en Java manipulan datos elementales y, crucialmente, <strong>no son objetos</strong> (por diseño, para rendimiento). A diferencia de los lenguajes como Ruby, <code>int</code> no hereda de <code>Object</code>.</p>

<p>Cuando declaras una variable local primitiva dentro de un método, esta variable y su valor se almacenan en el <strong>Thread Stack</strong> (la Pila). Cuando el método termina, el frame de la pila se descarta instantáneamente (O(1) pop), liberando la memoria. No interviene el Garbage Collector para estas variables.</p>

<table>
<tr><th>Tipo</th><th>Bits (Memoria)</th><th>Rango / Notas de Arquitectura</th></tr>
<tr><td><code>byte</code></td><td>8 bits</td><td>-128 a 127. Útil para manipulación a nivel de bytes (ej. Network I/O).</td></tr>
<tr><td><code>short</code></td><td>16 bits</td><td>-32,768 a 32,767. Poco usado en el desarrollo moderno de Java.</td></tr>
<tr><td><code>int</code></td><td>32 bits</td><td>-2,147,483,648 a 2,147,483,647. El número entero por defecto. Usa complemento a 2.</td></tr>
<tr><td><code>long</code></td><td>64 bits</td><td>-9 quintillones a 9 quintillones. Necesario para IDs de BD grandes o timestamps Unix (ms). Sufijo <code>L</code> (ej. 100L).</td></tr>
<tr><td><code>float</code></td><td>32 bits</td><td>IEEE 754 Precisión Simple. Sufijo <code>f</code>. <b>Precaución: No usar para dinero</b> (pierde precisión).</td></tr>
<tr><td><code>double</code></td><td>64 bits</td><td>IEEE 754 Precisión Doble. Decimal por defecto. <b>Precaución: No usar para dinero</b>. Usa <code>BigDecimal</code>.</td></tr>
<tr><td><code>char</code></td><td>16 bits</td><td>Almacena un único carácter Unicode (UTF-16). Valor numérico 0 a 65,535. Literales en comillas simples <code>'A'</code>.</td></tr>
<tr><td><code>boolean</code></td><td>Dependiente de la JVM</td><td>Conceptualmente 1 bit, pero en memoria los arrays de booleans se guardan como arrays de bytes (8 bits) y variables individuales pueden ocupar un 'int' (32 bits) debido a la alineación de palabras (word alignment) de las CPUs de 32/64 bits.</td></tr>
</table>

<h3>Variables de Referencia (Objetos)</h3>
<p>Cuando creas un objeto con <code>new PalabraClave()</code>, ocurren dos cosas a nivel de memoria:</p>
<ol>
    <li>El objeto en sí mismo (sus datos y metadatos) se instancia dinámicamente en el <strong>Heap</strong>.</li>
    <li>La variable local de tipo referencia (que podemos ver como un puntero seguro en C++) se almacena en el <strong>Stack</strong> (la Pila). Esta referencia guarda la dirección de memoria en el Heap (o un handle/offset dependiente de la JVM) donde vive el objeto real.</li>
</ol>
<p>Cuando pierdes la referencia del Stack (el método termina) o la sobrescribes, el objeto en el Heap queda "huérfano". Eventualmente, el Garbage Collector lo escaneará, se dará cuenta de que es inaccesible desde cualquier <em>GC Root</em> (como las pilas activas) y reclamará esa memoria.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// En la pila: 'edad' con valor literal 25
int edad = 25; 

// En la pila: 'persona', contiene una dirección de memoria (ej. 0x00FF8C)
// En el Heap: Un objeto de tipo Persona ocupando ~24-32 bytes
Persona persona = new Persona("Carlos");</code></pre></div>

<h2>Operadores y Evaluación de Cortocircuito (Short-Circuit)</h2>
<p>Los operadores lógicos <code>&&</code> (AND) y <code>||</code> (OR) son operadores de "cortocircuito". Esto es fundamental para evitar NullPointerExceptions y mejorar el rendimiento.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">String nombre = obtenerNombreDeBD(); // Podría devolver null

// Correcto: Si 'nombre' es null, la primera condición es falsa. 
// El cortocircuito de && evita evaluar 'nombre.length()', previniendo el NPE.
if (nombre != null && nombre.length() > 0) {
    System.out.println("Tenemos un nombre válido: " + nombre);
}

// Bitwise Operators (A nivel de bit) - Manipulación directa de los 1s y 0s
int a = 5;  // 0101 en binario
int b = 3;  // 0011 en binario
System.out.println(a & b);  // AND bit a bit (0001 -> 1)
System.out.println(a | b);  // OR bit a bit (0111 -> 7)
System.out.println(a ^ b);  // XOR bit a bit (0110 -> 6)
System.out.println(~a);     // NOT bit a bit (invierte bits, resultando en -6 por el complemento a 2)
System.out.println(a << 1); // Shift Left (Desplaza a la izquierda, equivalente a multiplicar por 2 -> 10)
System.out.println(a >> 1); // Shift Right con signo (Desplaza preservando el signo, divide por 2 -> 2)
System.out.println(a >>> 1); // Shift Right sin signo (Llena con ceros, útil para manipulación binaria pura de bytes)</code></pre></div>
`
    },
    {
        id: 'control-flow', num: '03', title: 'Flujo de Control y Rendimiento de la JVM',
        body: `
<h2>Optimización de Saltos Condicionales</h2>
<p>El código fuente de Java se compila a instrucciones de bytecode (como <code>if_icmpeq</code>, <code>goto</code>). Las arquitecturas de CPU modernas usan <strong>Branch Prediction</strong> (Predicción de Salto) en sus pipelines (tuberías de ejecución). Los condicionales <code>if</code> altamente predecibles (ej. datos ordenados en un bucle) se ejecutan drásticamente más rápido en el nivel del procesador que los datos aleatorios debido a los "branch mispredictions" o castigos por fallos en la predicción.</p>

<h3>Switch: tableswitch vs lookupswitch</h3>
<p>Históricamente, el estamento <code>switch</code> en Java no es solo azúcar sintáctico sobre mútiples <code>if-else</code>. A nivel de bytecode, la JVM genera dos estructuras muy diferentes y eficientes dependiendo de tus casos (cases):</p>
<ul>
    <li><code>tableswitch</code>: Se genera cuando los valores del <code>case</code> son secuenciales o casi densos (ej. 1, 2, 3, 5). El compilador crea una tabla de saltos estática en memoria. El rendimiento es <strong>O(1)</strong> constante instantáneo basado en un offset matemático.</li>
    <li><code>lookupswitch</code>: Se genera cuando los valores tienen brechas gigantes (ej. 100, 5000, 99999). Usa una búsqueda binaria entre los condicionales, logrando un rendimiento de <strong>O(log N)</strong>.</li>
    <li><strong>Strings en switch (Java 7+):</strong> Hace un hash rápido del String y luego usa un <code>lookupswitch</code> para encontrar coincidencia, con resolución de colisiones de <code>equals()</code> en el estamento oculto.</li>
</ul>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Pattern Matching para Switch (Java 17-21+)
// Cambia completamente el paradigma hacia la Programación Funcional
Object obj = procesarRespuestaAsincrona();

String representacion = switch (obj) {
    case Integer i when i > 0 -> "El número positivo es: " + i; // Guarded Pattern
    case Integer i -> "El número negativo/neutro es: " + i;
    case String s && s.isBlank() -> "Es un texto vacío";
    case String s -> "Texto de " + s.length() + " caracteres";
    case Usuario u -> "El usuario es: " + u.correo(); // Desempaquetado de Record
    case null -> "Error: El objeto recibido es null"; // Manejo nativo de Null
    default -> "Tipo desconocido no soportado en esta capa de negocio";
};</code></pre></div>

<h2>Bucles y Loop Unrolling (JIT Compiler)</h2>
<p>El compilador en caliente (JIT) aplica técnicas como <em>Loop Unrolling</em> (Desenrollado de Bucles). Si tienes un bucle for tradicional que itera 100 veces asignando un array, el JIT podría reescribir transparentemente el ensamblador para que haga de 8 en 8 saltos por ciclo, minimizando la sobrecarga de evaluación de la condición final e incremento del puntero.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Unenhanced loop - Tenebrosamente ineficiente si la colección es LinkedList
for (int i = 0; i < lista.size(); i++) {
    // Si lista es LinkedList, get(i) es O(N), por lo que el bucle completo es O(N^2) catastrófico
    procesar(lista.get(i)); 
}

// Enhanced for loop (For-Each) - Siempre seguro y óptimo
// Por debajo, el compilador lo reescribe utilizando el patrón Iterator automáticamente.
// Mantiene O(N) lineal para CUALQUIER tipo de Collection (incluyendo iteraciones de LinkedList)
for (Elemento e : lista) {
    procesar(e);
}</code></pre></div>
`
    },
    {
        id: 'arrays-strings', num: '04', title: 'Arrays vs Memoria y El String Pool',
        body: `
<h2>Arrays: Locación en Caché L1/L2 (Cache Locality)</h2>
<p>En Java, un array es el único objeto de tipo referencia garantizado de ser asignado en un bloque de memoria 100% contiguo a nivel físico en el Heap. Esto da una enorme ventaja de rendimiento conocida como <strong>"Cache Locality" (Localidad en Caché o Spatial Locality)</strong>.</p>
<p>Cuando la CPU lee el índice 0, transfiere una "línea de caché" entera (típicamente 64 bytes) a las cachés L1/L2 ultrarrápidas del procesador. Por lo tanto, leer los índices 1 a 15 toma prácticamente cero ciclos de reloj. Si es una lista enlazada o referencias aleatorias, genera "Cache Misses" severos que ralentizan el microprocesador buscando en la lenta RAM.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Matrix traversal (Cruce de matrices) a alto rendimiento
int[][] matriz = new int[5000][5000];

// CORRECTO y ÓPTIMO: Iteración Row-Major (Primero filas, luego columnas)
// Explota la localidad espacial caché L1 de forma agresiva. El array interno es contiguo.
for (int fila = 0; fila < 5000; fila++) {
    for (int col = 0; col < 5000; col++) {
        matriz[fila][col]++; // Acceso continuo y secuencial a la línea de caché (Microsegundos)
    }
}

// INCORRECTO: Iteración Column-Major (Primero columnas, luego filas)
// Genera saltos inmensos en direcciones físicas de memoria destruyendo el caché cada iteración
for (int col = 0; col < 5000; col++) {
    for (int fila = 0; fila < 5000; fila++) {
        matriz[fila][col]++; // "Cache Thrashing", toma hasta 10-20x MÁS tiempo de ejecución
    }
}</code></pre></div>

<h2>Arquitectura Interna de Strings</h2>
<p>La inmutabilidad de la clase <code>String</code> es crítica por seguridad (evita que APIs cambien contraseñas subyacentes por error), multithreading (es thread-safe nato sin necesidad de <code>synchronized</code>) y para habilitar el patrón <strong>String Pool</strong> (Piscina de Strings).</p>

<h3>El String Pool (Interning)</h3>
<p>Para ahorrar masivas cantidades de memoria, la JVM mantiene un área especial en la memoria Heap reservada para Strings literales. Si declaras un String explícitamente y éste ya existe bit por bit en el Pool, la JVM jamás creará un nuevo objeto, sino que devolverá un puntero al objeto preexistente reutilizado.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">String s1 = "Desarrollo"; // Va al String Pool
String s2 = "Desarrollo"; // Retorna referencia idéntica del Pool (no usa RAM extra)

System.out.println(s1 == s2); // TRUE. Ambas referencias apuntan a la misma dirección 0xAB...

// ¡ERROR COMÚN ARQUITECTÓNICO! Uso del operador 'new' para Strings
String s3 = new String("Desarrollo"); // Fuerzas un NUEVO objeto foráneo FUERA del Pool en el Heap normal

System.out.println(s1 == s3);       // FALSE. Direcciones de memoria distantes.
System.out.println(s1.equals(s3));  // TRUE. El contenido carácter por carácter es idéntico.

// Puedes forzar a que un String alojado en el heap común entre por la fuerza al Pool
String internalizado = s3.intern();
System.out.println(s1 == internalizado); // TRUE de nuevo.</code></pre></div>

<h3>Rendimiento: StringBuilder vs StringBuffer</h3>
<p>Concatenar Strings en un bucle como <code>resultado += "a"</code> en Java recrea objetos estúpidamente lentos creando sobrecarga al recolector de basura (O(N^2)). Para concatenaciones dinámicas masivas usamos buffers internos basados en Arrays re-dimensionables:</p>
<ul>
    <li><code>StringBuilder</code>: No es Thread-Safe. Más rápido, es la opción preferida por defecto en código interno de métodos y arquitecturas que comparten hilo único por Request de Backend.</li>
    <li><code>StringBuffer</code>: Clave palabra heredada, todos sus métodos append() son <code>synchronized</code> y sufren Overhead por el lockeo mutex interno. Usa exclusivamente en concurrencia extrema compartida, o mejor, diseña arquitecturas que no requieran buffers mutables compartidos globales.</li>
</ul>
`
    },
    {
        id: 'oop', num: '05', title: 'Fundamentos de OOP (V-Tables y Memoria)',
        body: `
<h2>El Header de Memoria del Objeto (Object Layout)</h2>
<p>Un objeto en Java no es solo la suma de sus campos de instancia; tiene una sobrecarga y metadatos alojados en el Heap, llamado <em>Object Header</em>. Un objeto vacío en Java 64-bits consume al menos 16 bytes. El "Header" contiene:</p>
<ul>
    <li><strong>Mark Word (8 bytes):</strong> Contiene el HashCode de identidad por defecto (System.identityHashCode()), datos de edad generacional del Garbage Collector, y un bitmask reservado para locks/mutex (estado de sincronización, bias locking en Single Threads).</li>
    <li><strong>Klass Pointer (4 a 8 bytes dependiendo del OOP Compress):</strong> Referencia directa a la definición de la clase exacta del objeto guardada en el Metaspace que habilita la reflexión y el polimorfismo de enrutamiento a los métodos verdaderos implementados.</li>
</ul>

<h2>Despacho Dinámico y la V-Table (Virtual Method Table)</h2>
<p>Concepto nuclear para Entrevistas de Arquitectura nivel Senior. A diferencia de C++ donde existe separación de métodos estáticos y métodos <code>virtual</code>, en Java <strong>TODOS</strong> los métodos public y protected de instancia de objeto son "virtuales" por diseño permitiendo el <strong>Polimorfismo / Dynamic Dispatch (Despacho Dinámico en Tiempo de Ejecución)</strong>.</p>
<p>Cuando un compilador asocia a una llamada a un método de tipo <code>Animal a = new Perro()</code>, y detecta que llamas a <code>a.ladrar()</code>, el compilador (resolución estática) comprueba que existe la silueta en <code>Animal</code>. PERO, en tiempo de ejecución de JVM, el motor de ejecución mira el "Klass Pointer" que definimos antes, sigue ese puntero binario al Metaspace y aterriza en la "tabla virtual de salto (vtable)" interna de la clase real <code>Perro</code>. Allí llama ciegamente a la dirección real de la silueta sustituida. A esto se le llama Early Binding vs Late Binding. Genera un retraso o costo imperceptible en performance frente al "Inlining" si un método no se declara <code>final</code>.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class Empleado {
    protected int salarioBase;
    public Empleado() { this.salarioBase = 1000; }
    
    // Virtual Method predeterminado. Ocupará una ranura en la VTable subyacente de JVM
    public int calcularBonus() { return salarioBase / 10; } 
    
    // Método estático (Ocultamiento/Hiding) NO participa en despachos polimórficos de la vTable (Early Binding / Static Dispatching C-like en tiempo comp.)
    public static void printReglasGlobales() { System.out.println("Reglas de la empresa genérica"); }
}

public class Gerente extends Empleado {
    // Al sobreescribir (Override), Java reescribe ese índice exacto de la vtable apuntando a memoria diferente
    @Override 
    public int calcularBonus() { return salarioBase * 2; } 
    
    // Peligro arquitectónico. Esto OCULTA, no sobreescribe de forma polimórfica (Hiding de Variable/Método estático).
    public static void printReglasGlobales() { System.out.println("Reglas estrictas gerenciales"); }
}

public class Main {
    public static void main(String[] args) {
        Empleado emp = new Gerente(); 
        
        System.out.println(emp.calcularBonus()); // Dynamic Dispatch en VTable -> Impresionante. Output: 2000 (Invoca Gerente)
        
        // Anti-pattern. Dependencia de variables estáticas heredadas
        emp.printReglasGlobales(); // Static Resolution por lado del Compilador Estático. Output: "Reglas de la empresa genérica"
    }
}
</code></pre></div>

<h2>Modificadores de Acceso Avanzados (Recordatorio Encapsulamiento)</h2>
<ul>
    <li><code>private</code>: Límite al cuerpo interno total y absoluto de la propia clase. Clave para SRP (Responsabilidad Única) y esconder la entropía interna.</li>
    <li><em>(Package-Private / Default sin palabra)</em>: Visibilidad límite hacia todas las clases pertenecientes del mismo sub-directorio de carpetas lógicas. Patrón arquitectónico vital predeterminado donde varias clases cooperan internamente pero el Service Gateway exterior expone APIs en otra carpeta usando <code>public</code>.</li>
    <li><code>protected</code>: Visibilidad límite hacia package-private + límite abierto en herencias interpaquetes fuera del directorio que tengan extends.</li>
    <li><code>public</code>: API Exterior de Sistema. Extremadamente propenso a roturas de refactoring. Acoplamiento altísimo. Evita exponer objetos de dominio sin pensarlo.</li>
</ul>

<h2>Constructores Subyacentes de Cadena (Constructor Chaining)</h2>
<p>Todos los constructores de cualquier clase siempre terminan, explícita o implícitamente, llamando a <code>super()</code> en su bloque invisible como su primerísima instrucción de byte-code. Esto certifica y garantiza recursivamente la inicialización del objeto final "Dios", es decir: <code>java.lang.Object</code> y todos los ancestros intermedios, preveyendo desfasajes de estados inconsistentes antes de armar las referencias a la memoria RAM hija total.</p>
`
    }
];
