/**
 * JavaPedia — Spanish Content (Sections 6-10) - DEEP DIVE
 */
const CONTENT_ES_02 = [
    {
        id: 'inheritance', num: '06', title: 'Herencia y Arquitectura de Dominio',
        body: `
<h2>El Principio de Sustitución de Liskov (LSP)</h2>
<p>La herencia (extender clases) es el pilar más abusado de la Programación Orientada a Objetos. Arquitectónicamente, la herencia en Java modela una relación <strong>"Es-Un" (Is-A)</strong>. El principio LSP (letra L de S.O.L.I.D) dicta que si una clase <i>Gerente</i> hereda de <i>Empleado</i>, un objeto de tipo Gerente debe poder reemplazar a un Empleado en cualquier parte del código <strong>sin fallar y sin alterar el comportamiento esperado del programa</strong>. Si sobreescribes un método en el hijo y lanzas un <code>UnsupportedOperationException</code>, estás violando LSP.</p>

<h2>Favorecer la Composición sobre la Herencia</h2>
<p>En el diseño de software empresarial moderno, se prefiere la <strong>Composición (Relación "Tiene-Un" o Has-A)</strong> antes que la Herencia. La herencia rompe el encapsulamiento: la clase hija depende íntimamente de los detalles de implementación de la clase padre. Si el padre cambia, el hijo puede romperse (El problema de la <em>Clase Base Frágil</em>).</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Antipatrón: Herencia (Is-A)
// ¿Un Motor "es un" Coche? NO. Esto hereda un montón de métodos inútiles y acopla el código.
public class Coche extends Motor { 
    public void arrancar() { super.encender(); }
}

// Patrón Arquitectónico Correcto: Composición (Has-A)
// Un Coche "tiene un" Motor. Delegamos la lógica, logrando bajo acoplamiento y permitiendo inyectar diferentes motores.
public class Coche {
    private final Motor motor; // Dependencia explícita y encapsulada
    
    // Inversión de Control (IoC) - Recibe la dependencia desde fuera
    public Coche(Motor motor) {
        this.motor = motor;
    }
    
    public void arrancar() {
        this.motor.encender();
    }
}</code></pre></div>

<h2>¿Por qué Java prohíbe la Herencia Múltiple de Estado?</h2>
<p>A diferencia de C++, Java no permite que una clase extienda múltiples clases base (<code>class A extends B, C</code>) para evitar el temido <strong>Problema del Diamante (Diamond Problem)</strong>. Si <code>B</code> y <code>C</code> ambas heredan de <code>Z</code> y modifican una variable de estado protegida o sobrescriben un mismo método, cuando <code>A</code> llama a ese método, ¿a qué implementación debe enrutar la JVM la llamada en la V-Table? Para mantener el compilador rápido y la arquitectura segura, Java fue diseñado obligando a la herencia simple de estado, pero permitiendo implementación múltiple de contratos a través de <em>Interfaces</em>.</p>
`
    },
    {
        id: 'interfaces', num: '07', title: 'Interfaces y Clases Abstractas: Evolución',
        body: `
<h2>El Bytecode subyacente: invokevirtual vs invokeinterface</h2>
<p>Cuando llamas a un método desde un tipo de referencia Abstracto (Clase), la JVM en ensamblador usa la instrucción <code>invokevirtual</code>, que es un salto puramente posicional de offset en memoria en la V-Table. Toma 2-3 ciclos de reloj.</p>
<p>Pero cuando la variable de referencia es una <strong>Interface</strong>, la JVM no conoce el árbol jerárquico real del objeto en tiempo de compilación. Genera una instrucción <code>invokeinterface</code>. Antiguamente, esto requería hacer un escaneo y búsqueda a través del ITABLE (Interface Method Table) de la clase en el heap en tiempo de ejecución, lo cual era notablemente más lento. Hoy en día, el JIT Compiler usa cachés de despacho en línea (Inline Caching) para anular esta diferencia casi a cero en el 90% de las invocaciones "Megamórficas".</p>

<h2>Evolución de API: Métodos Default (Java 8+)</h2>
<p>El mayor problema histórico de Java hasta la versión 7 era el <strong>"Infierno de la Retrocompatibilidad"</strong>. Si publicabas una librería y decidías agregar un nuevo método obligatorio a tu interface <code>Lector</code>, obligabas a todos los millones de desarrolladores del mundo que usaban tu librería a reescribir e implementar dicho método obligatoriamente, rompiendo compilaciones enteras a nivel global.</p>
<p>Con <code>default methods</code>, puedes <strong>evolucionar</strong> la interface inyectando métodos con implementación base sin romper las clases cliente que aún no saben que existe el método.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public interface Repositorio&lt;T&gt; {
    // Contrato estricto (Desde v1.0)
    void guardar(T entidad);
    T buscarPorId(Long id);

    // Método inyectado en la API en la v2.0 usando el poder de default
    // ¡Ninguna clase cliente que implemente esta interfaz dejará de compilar!
    default void guardarTodos(Iterable&lt;T&gt; entidades) {
        for (T entidad : entidades) {
            guardar(entidad); // Llama al método abstracto local, forzando consistencia
        }
    }
}</code></pre></div>

<h2>Resolviendo Conflictos Default</h2>
<p>Si una clase implementa dos interfaces y amas tienen un método <code>default</code> con la <strong>misma firma exacta</strong>, el compilador obliga a la clase a resolver el choque manualmente para evitar ambigüedades, obligándote a sobreescribirlo.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class CocheAutonomo implements Vehiculo, Dron {
    // Ambas interfaces Vehiculo y Dron tienen un método: default void conducir() { ... }
    
    @Override
    public void conducir() {
        // Debes elegir explícitamente a cuál padre acatar, o crear tu propia lógica
        Vehiculo.super.conducir(); // Enrutamiento directo al código padre evadiendo la sobreescritura actual
    }
}</code></pre></div>
`
    },
    {
        id: 'exceptions', num: '08', title: 'Excepciones, Costos Ocultos y Anti-Patrones',
        body: `
<h2>El Costo Oculto: Stack Trace Generation</h2>
<p>Instanciar un objeto en Java es barato, pero <strong>instanciar una Excepción es terriblemente costoso</strong> (100 a 1000 veces más lento que crear un objeto normal). ¿Por qué? Cuando ejecutas <code>new Exception()</code> o <code>throw e</code>, y en el constructor predeterminado entra en el método nativo en código C++ llamado <code>fillInStackTrace()</code>.</p>
<p>Este método le dice a la JVM: "Pausa el hilo de ejecución actual, examina el sistema operativo, haz un volcado completo de la Pila de Llamadas (Stack), encuentra qué método llamó a qué, en qué archivo .java y en qué número exacto de línea, y convierte todo eso en texto (String)".</p>

<div class="callout callout-warning"><div class="callout-title"><i class="fas fa-exclamation-triangle"></i> Arquitectura Anti-Patrón </div><strong>Control de Flujo con Excepciones (Exception-Driven Logic)</strong>. NUNCA uses bloques try-catch para gobernar decisiones if/else o la salida de bucles que suceden de forma ordinaria en tu negocio (ej: atrapar <code>NumberFormatException</code> para ver si un texto es numérico es un crimen penal contra la CPU). Úsalas SOLO para situaciones "Excepcionales" y catastróficas.</div>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Optimización extrema para Servidores de Alta Demanda:
// Excepción estática sin StackTrace
public class UserNotFoundException extends RuntimeException {
    
    // Suprimimos la generación de la Pila, los mensajes y todo overhead.
    // Esta excepción es "gratis" al ser lanzada y viaja instantáneamente por la red.
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this; // Interceptamos y anulamos la penalidad del volcado del CallStack
    }
}</code></pre></div>

<h2>Try-With-Resources (Under the Hood)</h2>
<p>Introducido en Java 7. Las Clases de I/O de red, Bases de datos o Ficheros implementan la interfaz <code>AutoCloseable</code>.  El bloque especial cierra el recurso incluso si salta una excepción catastrófica durante el procesamiento del archivo. Y lo hace mejor que tú, porque maneja "Supressed Exceptions" (cuando el método <code>close()</code> falla lanzando una segunda excepción pisando a la original).</p>
<p><strong>A nivel Bytecode:</strong> La JVM reescribe este bloque inyectando múltiples bloques <code>finally</code> ocultos garantizados para ti, previniendo Fugas de Memoria (Memory Leaks / File Descriptor Leaks).</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Se asegura que dejen de existir File Descriptors huérfanos en el OS
try (
    Connection conn = db.getConnection(); 
    PreparedStatement ps = conn.prepareStatement(query);
    ResultSet rs = ps.executeQuery() // Cada componente se abre y es AutoCloseable
) {
    while (rs.next()) {
        System.out.println(rs.getString("nombre"));
    }
} catch (SQLException e) {
    logger.error("Error en DB, pero los 3 recursos fueron cerrados EN ORDEN INVERSO ciegamente.", e);
}</code></pre></div>
`
    },
    {
        id: 'collections', num: '09', title: 'Colecciones (Big-O y HashMap Internals)',
        body: `
<h2>Análisis Big-O en Listas</h2>
<ul>
    <li><strong>ArrayList:</strong> Basado en un Array dinámico.
        <ul>
            <li>Lectura por índice <code>get(i)</code>: <strong>O(1)</strong> asombrosamente rápido (Cache L1 Locality).</li>
            <li>Búsqueda por valor <code>contains(o)</code>: <strong>O(N)</strong> lineal (Peor de los casos).</li>
            <li>Inserción <code>add()</code>: <strong>Amortizado O(1)</strong>. Cuando se llena internamente, recrea un nuevo Array un %50 (1.5x) más grande y copia via C nativo el bloque de memoria entero (<code>System.arraycopy</code>).</li>
        </ul>
    </li>
    <li><strong>LinkedList:</strong> Punteros doblemente enlazados en todo el Heap.
        <ul>
            <li>Lectura por índice <code>get(i)</code>: <strong>O(N)</strong> lento, castigo por Fragmentación en el Heap.</li>
            <li>Inserción en extremos (Head/Tail): <strong>O(1)</strong> constante y perfecto para Colas Puras (Queues).</li>
        </ul>
    </li>
</ul>

<h2>Sumergiéndonos en el Core de HashMap</h2>
<p>El <code>HashMap</code> es probable la estructura top 3 más importante del lenguaje entero. Arquitectónicamente, es un Array tradicional compuesto de celdas llamadas <strong>"Buckets"</strong>. Por defecto inicializa con 16 buckets. Usa una función Hash matemática para saber a qué índice saltar.</p>

<h3>Flujo de Inserción (Put):</h3>
<ol>
    <li>Llamas a <code>map.put(K, V)</code>.</li>
    <li>El mapa llama a <code>K.hashCode()</code>.</li>
    <li>Aplica una perturbación matemática de bits XOR extra (Haciendo <i>shift</i> a la derecha del hashcode) para mitigar colisiones cuando el array es pequeño.</li>
    <li>Hace la operación bitwise <code>(n - 1) &amp; hash</code> (equivalente ultrarrápido a <code>hash % capacidadArray</code>) para encontrar el índice exacto del 0 al 15 del Bucket destino local. <strong>Esto es una operación O(1)</strong>.</li>
    <li>Mete el Dato en un <em>Nodo (Map.Entry)</em> en ese índice.</li>
</ol>

<h3>Colisiones Aleatorias y Treeification (Java 8+)</h3>
<p>Si la matemática dicta el mismo Bucket para dos claves distintas, sucede una Colisión. En Java 7, el Bucket se convertía internamente en una simple LinkedList, metiendo objetos en cascada. El problema con el ataque de denegación (Hash DoS), es que un atacante puede crear millones de strings maliciosos diseñados a apuntar al bucket 0. El HashMap de O(1) se degradaba a buscar a través de la lista en O(N) logrando matar un servidor Xeon en 3 segundos.</p>
<p><strong>La Solución Arquitectónica (Treeification):</strong> En Java 8, si una colisión ocurre para la misma celda de Bucket y esa LinkedList llega al umbral estático de longitud = 8 objetos, la JVM deforma localmente la lista de ese Bucket y la re-balancea en un <strong>Árbol Rojo-Negro (Red-Black Binary Tree)</strong> en caliente. El rendimiento degrada solo a un espectacularmente resistente <strong>O(log N)</strong>, frustrando cualquier intento de hackeo por saturación algorítmica.</p>

<h3>El Factor de Carga (Load Factor)</h3>
<p>Por defecto es <code>0.75</code>. Significa que, de los 16 espacios iniciales, cuando la colección se llena al 75% de ocupación (12 items), desencadena automáticamente un proceso <strong>Re-Hash global pesado</strong> duplicando la memoria del vector a 32 espacios (para seguir mantiendo las matemáticas rápidas bitwise y las colisiones escasas). Es vital para APIs enormes iniciar los hash maps con una capacidad calculada usando: <code>new HashMap&lt;&gt;(elementosEsperados / 0.75 + 1)</code>.</p>
`
    },
    {
        id: 'generics', num: '10', title: 'Generics (Type Erasure & Heap Pollution)',
        body: `
<h2>El Secreto Oculto: Type Erasure (Borrado de Tipos)</h2>
<p>Cuando Sun Microsystems metió soporte con rombos (Generics) en Java 1.5 en el 2004, tenían un monumental desafío: los millones de sistemas bancarios con Java 1.4 tenían que poder cargar programas Java 5.0 en la misma máquina si que todo explotara. Eligieron la retrocompatibilidad estricta sobre la re-arquitectura nativa.</p>
<p><strong>El Type Erasure</strong> indica que los Generics en Java <strong>no existen en tiempo de ejecución de la JVM</strong> (A diferencia de los templates de C++ o Reified Generics de C#).</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Código fuente en el IDE
List&lt;String&gt; strings = new ArrayList&lt;&gt;();
strings.add("Arquitectura");
String valor = strings.get(0);

// MAGIA DEL COMPILADOR JAVAC (Lo que literalmente se escribe tras compilar)
List stringsDesnudas = new ArrayList(); // Remueve el tipo (Raw Type)
stringsDesnudas.add("Arquitectura");
// Y el compilador inyecta conversiones CASTS manuales forzadas por ti ciegamente
String valorSacado = (String) stringsDesnudas.get(0);</code></pre></div>

<p>A nivel de byte-code en la RAM, toda lista siempre maneja punteros a simple y llano <code>Object</code>. El azúcar sintáctico radica solo en comprobar los cast en el compilador del IDE de desarrollo. Esto limita algunas acciones como saber <code>if(lista instanceof List&lt;String&gt;)</code>: no es posible preguntar eso a nivel binario porque la métrica String ya fue aniquilada del byte-code subyacente de la RAM, sólo es <code>instanceof List</code>.</p>

<h2>Heap Pollution (Toxificación de la Memoria)</h2>
<p>Dado que la JVM no sabe en la fase de ejecución de qué tipado debe ser un ArrayList con Generics, sucede la Peligrosa Arquitectura del <em>Heap Pollution</em>: Mezclar código moderno (Java 5+) con librerías Legacy antiguas y lograr engañar al sistema provocando un ClassCastException inesperado en un archivo distante y ajeno que confunde totalmente al programador meses más tarde.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public static void hackearListaSegura() {
    // 1. Un desarrollador junior usando buenas practicas recientes compila esto:
    List&lt;String&gt; listaSegurizada = new ArrayList&lt;&gt;();

    // 2. Se inyecta la referencia en una librería Legacy (JAR de 1999 sin control):
    inyectarMaldad(listaSegurizada); 

    // 4. ¡¡ERROR FATAL EXPLOSIVO ClassCastException TARDÍO!!
    // Java trata de hacer un cast a String del Objeto y descubre que es un Coche a medio volar del programa.
    String extraido = listaSegurizada.get(0); 
}

public static void inyectarMaldad(List libreriaPreJava5) { // Usa código crudo o Raw Type
    // 3. Este bloque burla al compilador y añade un Integer dentro del generico de String, y este ni se entera en compilación
    libreriaPreJava5.add(Integer.valueOf(666)); 
}</code></pre></div>

<h2>Wildcards Acotados (Upper & Lower Bounds)</h2>
<p>Los Generics en Java <strong>Son Invariantes</strong>. (Una <code>Lista&lt;Perro&gt;</code> NO es un subtipo de <code>Lista&lt;Animal&gt;</code>).</p>
<p>Si la regla anterior fuera mentira, alguien podría obligar y meter ilegalmente un Gato en tu Lista de Perros haciendo el casting al Padre Animal. Pero para diseñar APIs genéricas necesitamos flexibilidad masiva. Es por eso que utilizamos WildCards (Comodines) con el principio <strong>P.E.C.S</strong>.</p>
<ul>
    <li><code>&lt;? extends T&gt;</code>: <strong>Producer Extends.</strong> Para métodos que solo leen o devuelven valores fuera de la colección. El compilador bloquea todas las inclusiones o agregados evitando accidentes polimórficos destructivos.</li>
    <li><code>&lt;? super T&gt;</code>: <strong>Consumer Super.</strong> Para métodos que solo procesaran y meterán un valor adentro específico a una lista en general, previniendo corrupciones de escritura entre primos lejanos de árbol.</li>
</ul>
`
    }
];
