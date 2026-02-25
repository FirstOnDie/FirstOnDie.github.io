/**
 * JavaPedia — English Content (Sections 1-5) - DEEP DIVE
 */
const CONTENT_EN_01 = [
    {
        id: 'intro', num: '01', title: 'Introduction to Java and Internal Architecture',
        body: `
<h2>What is Java?</h2>
<p>Java is an <strong>object-oriented</strong>, statically and strongly typed programming language, originally created by <em>James Gosling</em> and his team ("The Green Team") at Sun Microsystems in 1995. Initially named <em>Oak</em>, it was designed for interactive television before pivoting to the World Wide Web. Its core philosophy is <strong>"Write Once, Run Anywhere"</strong> (WORA), meaning that the code, once compiled, can run without modification on any device or operating system that has a Java Virtual Machine (JVM) implementation.</p>

<h2>The Architectural Triad: JDK, JRE, and JVM</h2>

<h3>1. JDK (Java Development Kit)</h3>
<p>This is the complete tool kit for the <strong>developer</strong>. Besides including the runtime environment (JRE), it provides:</p>
<ul>
    <li><code>javac</code>: The compiler that translates source code (<code>.java</code>) into bytecode (<code>.class</code>).</li>
    <li><code>javadoc</code>: Automatic API documentation generator from code comments.</li>
    <li><code>jdb</code> (Java Debugger): Command-line debugging tool.</li>
    <li><code>jps</code>, <code>jstat</code>, <code>jmap</code>: Performance monitoring and profiling tools.</li>
</ul>

<h3>2. JRE (Java Runtime Environment)</h3>
<p>The minimum runtime environment needed to <strong>run</strong> a precompiled Java application. It contains:</p>
<ul>
    <li>The Java Virtual Machine (JVM).</li>
    <li>The core Java libraries (Java Class Library - JCL) such as <code>java.lang</code>, <code>java.util</code>, <code>java.io</code>, etc.</li>
    <li>Environment configuration and property files.</li>
</ul>
<div class="callout callout-info"><div class="callout-title"><i class="fas fa-info-circle"></i> Note on Java 11+</div>Since Java 11, Oracle stopped distributing the JRE separately from the JDK. Now, the preference is to create custom, modular runtime environments using the <code>jlink</code> tool.</div>

<h3>3. JVM (Java Virtual Machine) — Deep Dive</h3>
<p>The JVM is the logical heart of Java. It is not physical hardware, but an abstract machine that interprets and executes <em>bytecode</em>. Its internal architecture consists of three main subsystems:</p>

<h4>A. Class Loader Subsystem</h4>
<p>Responsible for dynamically loading classes into memory at runtime. It follows a hierarchical delegation model:</p>
<ol>
    <li><strong>Bootstrap ClassLoader:</strong> Loads the fundamental native JRE classes (from <code>rt.jar</code> in Java 8 and earlier, or from base modules in Java 9+). It is written in native code (C++).</li>
    <li><strong>Extension ClassLoader:</strong> Loads extension classes (libraries located in the <code>jre/lib/ext</code> folder).</li>
    <li><strong>Application/System ClassLoader:</strong> Loads application-level classes specified in the <code>CLASSPATH</code> environment variable.</li>
</ol>

<h4>B. Runtime Data Areas (Memory Areas)</h4>
<p>The JVM reserves different memory spaces managed by the operating system:</p>
<ul>
    <li><strong>Method Area (Metaspace in Java 8+):</strong> Stores class-level structures like the Runtime Constant Pool, interface names, fields, methods, and constructor code. It is shared memory across all threads. <em>In Java 8+, "PermGen" was removed and replaced by "Metaspace", which uses native OS memory to avoid OutOfMemoryError issues.</em></li>
    <li><strong>Heap:</strong> The main shared memory area where all objects and arrays are allocated. The Garbage Collector primarily operates here to clean up unreferenced objects.</li>
    <li><strong>Stack:</strong> Each execution thread has its own private stack. It stores <em>frames</em>. Every time a method is called, a new frame is created holding local variables and partial results, and participates in method returns and exception dispatching. Since each thread has its own, it is inherently Thread-Safe for local variables (primitives and references).</li>
    <li><strong>PC Register (Program Counter):</strong> Each thread has its PC Register, containing the physical memory address of the JVM instruction currently being executed.</li>
    <li><strong>Native Method Stack:</strong> Stores the state of native methods (written in C, C++, etc.) invoked via JNI (Java Native Interface).</li>
</ul>

<h4>C. Execution Engine</h4>
<p>The engine that actually executes the loaded bytecode in memory:</p>
<ul>
    <li><strong>Interpreter:</strong> Reads the bytecode sequentially and executes it. It starts up quickly but is slow for repetitive execution because every instruction must be interpreted every time.</li>
    <li><strong>JIT Compiler (Just-In-Time Compiler):</strong> To counteract the interpreter's slowness, the JVM uses the JIT. It monitors frequently executed bytecode (so-called <em>"hot spots"</em>). When it identifies a heavily used method or loop, the JIT directly compiles that specific bytecode into native machine code and caches it. The next time, it executes the ultra-fast native code without interpreting.</li>
    <li><strong>Garbage Collector (GC):</strong> Background daemon algorithm that frees memory by reclaiming space from objects that no longer have active references in the program. Modern algorithms include G1GC (Garbage First) and ZGC (Z Garbage Collector, sub-millisecond pause latencies).</li>
</ul>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Demystifying "Hello World"
public class HelloWorld {
    // 'public' (Access modifier: globally visible to the JVM)
    // 'static' (Method belongs to the class, requires no instantiation to invoke)
    // 'void'   (Returns no value)
    // 'main'   (The standardized entry point the JVM looks for)
    // 'String[] args' (Command-line arguments passed in)
    public static void main(String[] args) {
        // 'System' is a final class in java.lang
        // 'out' is a static PrintStream variable
        // 'println' is an overloaded method of PrintStream
        System.out.println("Hello, World from the internals!");
    }
}</code></pre></div>
`
    },
    {
        id: 'syntax', num: '02', title: 'Basic Syntax and Typing (Memory Model)',
        body: `
<h2>Static and Strong Typing</h2>
<p>Java is <strong>statically</strong> and <strong>strongly typed</strong>. This reduces runtime errors by enforcing rigorous checks at compile time. You cannot assign a 'String' to an 'int' without explicit parsing or conversion.</p>

<h2>Primitive Types and the Memory Model</h2>
<p>Primitive types in Java handle basic data and, crucially, <strong>are not objects</strong> (by design, for performance). Unlike in languages like Ruby, an <code>int</code> does not inherit from <code>Object</code>.</p>

<p>When you declare a primitive local variable inside a method, this variable and its value are stored on the <strong>Thread Stack</strong>. When the method finishes, the stack frame is instantly discarded (O(1) pop), freeing the memory. The Garbage Collector is not involved with these variables at all.</p>

<table>
<tr><th>Type</th><th>Bits (Memory)</th><th>Range / Architecture Notes</th></tr>
<tr><td><code>byte</code></td><td>8 bits</td><td>-128 to 127. Useful for raw byte manipulation (e.g., Network I/O).</td></tr>
<tr><td><code>short</code></td><td>16 bits</td><td>-32,768 to 32,767. Rarely used in modern Java development.</td></tr>
<tr><td><code>int</code></td><td>32 bits</td><td>-2,147,483,648 to 2,147,483,647. The default integer number. Uses two's complement.</td></tr>
<tr><td><code>long</code></td><td>64 bits</td><td>-9 quintillion to 9 quintillion. Required for large DB IDs or Unix timestamps (in ms). Needs an <code>L</code> suffix (e.g., 100L).</td></tr>
<tr><td><code>float</code></td><td>32 bits</td><td>IEEE 754 Single Precision. <code>f</code> suffix. <b>Warning: Never use for currency</b> (loses precision).</td></tr>
<tr><td><code>double</code></td><td>64 bits</td><td>IEEE 754 Double Precision. Default decimal. <b>Warning: Never use for currency</b>. Use <code>BigDecimal</code> instead.</td></tr>
<tr><td><code>char</code></td><td>16 bits</td><td>Stores a single Unicode character (UTF-16). Numeric value 0 to 65,535. Uses single quotes <code>'A'</code>.</td></tr>
<tr><td><code>boolean</code></td><td>JVM Dependent</td><td>Conceptually 1 bit, but in memory, boolean arrays are stored as byte arrays (8 bits) and individual variables can take up an 'int' (32 bits) due to CPU 32/64-bit word alignment.</td></tr>
</table>

<h3>Reference Variables (Objects)</h3>
<p>When you create an object with <code>new Keyword()</code>, two things happen at the memory level:</p>
<ol>
    <li>The object itself (its data and metadata) is dynamically instantiated on the <strong>Heap</strong>.</li>
    <li>The local reference variable (analogous to a safe pointer in C++) is stored on the <strong>Stack</strong>. This reference holds the memory address in the Heap (or a JVM-dependent handle/offset) where the actual object lives.</li>
</ol>
<p>When the stack reference is lost (the method ends) or overwritten, the object on the Heap becomes "orphaned". Eventually, the Garbage Collector will scan it, realize it is unreachable from any <em>GC Root</em> (like active thread stacks), and reclaim that memory.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// On the Stack: 'age' with literal value 25
int age = 25; 

// On the Stack: 'person', holding a memory address (e.g., 0x00FF8C)
// On the Heap: A Person object occupying ~24-32 bytes
Person person = new Person("Charles");</code></pre></div>

<h2>Operators and Short-Circuit Evaluation</h2>
<p>The logical operators <code>&&</code> (AND) and <code>||</code> (OR) use "short-circuiting". This is vital for preventing NullPointerExceptions and improving performance.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">String name = fetchNameFromDB(); // Could return null

// Correct: If 'name' is null, the first condition is false. 
// The short-circuit nature of && skips evaluating 'name.length()', preventing the NPE.
if (name != null && name.length() &gt; 0) {
    System.out.println("Valid name found: " + name);
}

// Bitwise Operators - Direct manipulation of 1s and 0s
int a = 5;  // 0101 in binary
int b = 3;  // 0011 in binary
System.out.println(a & b);  // Bitwise AND (0001 -&gt; 1)
System.out.println(a | b);  // Bitwise OR (0111 -&gt; 7)
System.out.println(a ^ b);  // Bitwise XOR (0110 -&gt; 6)
System.out.println(~a);     // Bitwise NOT (inverts bits, resulting in -6 due to two's complement)
System.out.println(a &lt;&lt; 1); // Shift Left (equivalent to multiplying by 2 -&gt; 10)
System.out.println(a &gt;&gt; 1); // Signed Shift Right (preserves sign, divides by 2 -&gt; 2)
System.out.println(a &gt;&gt;&gt; 1); // Unsigned Shift Right (fills with zeros, useful for raw byte manipulation)</code></pre></div>
`
    },
    {
        id: 'control-flow', num: '03', title: 'Control Flow and JVM Performance',
        body: `
<h2>Optimizing Conditional Branches</h2>
<p>Java source code is compiled down to bytecode instructions (like <code>if_icmpeq</code>, <code>goto</code>). Modern CPU architectures use <strong>Branch Prediction</strong> in their execution pipelines. Highly predictable <code>if</code> conditionals (e.g., sorted data in a loop) execute drastically faster at the hardware level than random data because they avoid costly "branch mispredictions".</p>

<h3>Switch: tableswitch vs lookupswitch</h3>
<p>Historically, the <code>switch</code> statement in Java is not just syntactic sugar over multiple <code>if-else</code>s. At the bytecode level, the JVM generates two highly distinct and efficient structures depending on your cases:</p>
<ul>
    <li><code>tableswitch</code>: Generated when the <code>case</code> values are sequential or very dense (e.g., 1, 2, 3, 5). The compiler creates a static jump table in memory. Performance is a constant, instantaneous <strong>O(1)</strong> based on mathematical offset calculation.</li>
    <li><code>lookupswitch</code>: Generated when the values have massive gaps (e.g., 100, 5000, 99999). It employs a binary search among the cases, achieving an efficient <strong>O(log N)</strong> performance.</li>
    <li><strong>Strings in switch (Java 7+):</strong> Performs a fast hash of the String and then uses a <code>lookupswitch</code> to find a match, resolving potential hash collisions with hidden <code>equals()</code> statements.</li>
</ul>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Pattern Matching for Switch (Java 17-21+)
// Completely shifts the paradigm towards Functional Programming
Object obj = processAsyncResponse();

String representation = switch (obj) {
    case Integer i when i &gt; 0 -&gt; "Positive number: " + i; // Guarded Pattern
    case Integer i -&gt; "Negative/neutral number: " + i;
    case String s && s.isBlank() -&gt; "Is an empty text";
    case String s -&gt; "Text of " + s.length() + " chars";
    case User u -&gt; "The user is: " + u.email(); // Record destructuring
    case null -&gt; "Error: Received object is null"; // Native Null handling
    default -&gt; "Unknown type at this domain layer";
};</code></pre></div>

<h2>Loops and Loop Unrolling (JIT Compiler)</h2>
<p>The HotSpot JIT compiler applies techniques like <em>Loop Unrolling</em>. If you possess a traditional 'for' loop that iterates 100 times to populate an array, the JIT might transparently rewrite the internal assembly code to process chunks of 8 elements per cycle, thereby minimizing the overhead of evaluating the loop termination condition and incrementing the pointer repeatedly.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Unenhanced loop - Terrifyingly inefficient if the collection is a LinkedList
for (int i = 0; i &lt; list.size(); i++) {
    // If the list is a LinkedList, get(i) is O(N), making the entire loop a catastrophic O(N^2)
    process(list.get(i)); 
}

// Enhanced for loop (For-Each) - Always safe and optimal
// Under the hood, the compiler rewrites it using the Iterator pattern automatically.
// Maintains a linear O(N) performance for ANY kind of Collection (including LinkedList iterations)
for (Element e : list) {
    process(e);
}</code></pre></div>
`
    },
    {
        id: 'arrays-strings', num: '04', title: 'Arrays vs Memory and The String Pool',
        body: `
<h2>Arrays: CPU Cache Locality (Spatial Locality)</h2>
<p>In Java, an array is the only reference-type object guaranteed to be allocated as a 100% physically contiguous block of memory on the Heap. This yields an enormous performance advantage known as <strong>"Cache Locality" (or Spatial Locality)</strong>.</p>
<p>When the CPU reads index 0, it transfers an entire "cache line" (typically 64 bytes) into the ultra-fast L1/L2 caches of the processor. Therefore, fetching indexes 1 through 15 takes virtually zero clock cycles. In contrast, scattered references in memory (like nodes in a LinkedList) generate severe "Cache Misses," forcing the microprocessor to stall while fetching data from the agonizingly slow main RAM.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// High-performance matrix traversal
int[][] matrix = new int[5000][5000];

// CORRECT and OPTIMAL: Row-Major iteration (Rows first, then columns)
// Aggressively exploits L1 spatial cache locality. The inner array memory is contiguous.
for (int row = 0; row &lt; 5000; row++) {
    for (int col = 0; col &lt; 5000; col++) {
        matrix[row][col]++; // Continuous sequential hits on the cache line (Microseconds)
    }
}

// INCORRECT: Column-Major iteration (Columns first, then rows)
// Mandates massive physical address jumps in memory, destroying the cache on every iteration
for (int col = 0; col &lt; 5000; col++) {
    for (int row = 0; row &lt; 5000; row++) {
        matrix[row][col]++; // "Cache Thrashing" — can take up to 10-20x LONGER to execute
    }
}</code></pre></div>

<h2>Internal Architecture of Strings</h2>
<p>The immutability of the <code>String</code> class is critical for security (prevents malicious APIs from altering underlying passwords), multithreading (inherently thread-safe without needing <code>synchronized</code> blocks), and enabling the <strong>String Pool</strong> design pattern.</p>

<h3>The String Pool (Interning)</h3>
<p>To curb massive memory consumption runaways, the JVM maintains a special area in the Heap reserved strictly for literal Strings. If you declare a String explicitly and a bit-for-bit identical sequence already exists in the Pool, the JVM refuses to allocate a new object. Instead, it returns a pointer back to that pre-existent shared object.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">String s1 = "Development"; // Enters the String Pool
String s2 = "Development"; // Grabs the exact identical reference from the Pool (zero extra RAM)

System.out.println(s1 == s2); // TRUE. Both references point to the exact same 0xAB... address

// COMMON ARCHITECTURAL ERROR! Usage of the 'new' operator for Strings
String s3 = new String("Development"); // Forces a BRAND NEW foreign object OUTSIDE the Pool in the standard Heap

System.out.println(s1 == s3);       // FALSE. Distant memory addresses.
System.out.println(s1.equals(s3));  // TRUE. The character-by-character content is identical.

// You can brute-force a standard heap String to enter the Pool via interning
String internedString = s3.intern();
System.out.println(s1 == internedString); // TRUE again.</code></pre></div>

<h3>Performance: StringBuilder vs StringBuffer</h3>
<p>String concatenation in a loop, like <code>result += "a"</code> in Java, recreationally spawns garbage objects leading to foolishly sluggish performance and heavy Garbage Collector overhead (O(N^2)). For massive dynamic concatenations, we employ internal mutable resizable-array buffers:</p>
<ul>
    <li><code>StringBuilder</code>: Not Thread-Safe. Far faster, it is the default choice for local method code and architectures employing isolated single-thread-per-request backends.</li>
    <li><code>StringBuffer</code>: Legacy class, every append() method is strictly <code>synchronized</code> leading to severe mutex locking overhead. Only use under instances of extreme shared concurrency, or better yet, engineer your architecture avoiding shared mutable global buffers altogether.</li>
</ul>
`
    },
    {
        id: 'oop', num: '05', title: 'OOP Fundamentals (V-Tables and Memory)',
        body: `
<h2>The Object Memory Header (Object Layout)</h2>
<p>An object in Java isn't just the raw summation of its instance fields; it inherently possesses overhead and metadata residing on the Heap, known as the <em>Object Header</em>. An empty object on a 64-bit Java VM invariably consumes at least 16 bytes. The "Header" consists of:</p>
<ul>
    <li><strong>Mark Word (8 bytes):</strong> Holds the default identity HashCode (System.identityHashCode()), generational age data for the Garbage Collector, and a synchronized bitmask meant for locks/mutex (locking state, biased locking in single-thread bursts).</li>
    <li><strong>Klass Pointer (4 to 8 bytes depending on OOP compression):</strong> A direct hardware reference pointing to the exact class definition of the object stashed inside the Metaspace. This actively enables reflection and polymorphic routing to the genuine overriding methods implemented.</li>
</ul>

<h2>Dynamic Dispatch and the Virtual Method Table (V-Table)</h2>
<p>A flagship concept for Senior Architectural Interviews. Contrary to C++ where there's a hard separation between static and <code>virtual</code> methods, in Java, <strong>EVERY</strong> public and protected instance method is intrinsically "virtual" by design. This unlocks robust <strong>Polymorphism / Dynamic Dispatch (Late Binding at Runtime)</strong>.</p>
<p>When a compiler parses a method call from <code>Animal a = new Dog()</code> binding such as <code>a.bark()</code>, the compiler (Static Resolution) verifies the blueprint exists inside <code>Animal</code>. HOWEVER, during JVM Execution Time, the execution engine probes the "Klass Pointer" we discussed previously, chases the binary pointer to the Metaspace, and descends into the internal "jump table (v-table)" belonging to the true class <code>Dog</code>. It blindly triggers the genuine address of the substituted behavior. This is opposed to Early Binding. It entails a minuscule performance hit compared to "Inlining" if a method was flagged <code>final</code>.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class Employee {
    protected int baseSalary;
    public Employee() { this.baseSalary = 1000; }
    
    // Default Virtual Method. Takes up a slot in JVM's underlying VTable
    public int calculateBonus() { return baseSalary / 10; } 
    
    // Static methods (Method Hiding) DO NOT participate in polymorphic vTable dispatches (Early Binding / C-like Static Dispatch at compile time)
    public static void printGlobalRules() { System.out.println("Generic company rules"); }
}

public class Manager extends Employee {
    // Overriding explicitly rewrites that exact vtable slot memory pointer pointing to differing logic
    @Override 
    public int calculateBonus() { return baseSalary * 2; } 
    
    // Architectural hazard. This HIDES, it does not polymorphically override (Static Method/Variable Hiding).
    public static void printGlobalRules() { System.out.println("Strict managerial rules"); }
}

public class Main {
    public static void main(String[] args) {
        Employee emp = new Manager(); 
        
        System.out.println(emp.calculateBonus()); // Dynamic Dispatch via VTable -&gt; Superb. Output: 2000 (Invokes Manager)
        
        // Anti-pattern. Legacy dependency on inherited static variables
        emp.printGlobalRules(); // Static Resolution by the Compile Engine. Output: "Generic company rules"
    }
}
</code></pre></div>

<h2>Advanced Access Modifiers (Encapsulation Recall)</h2>
<ul>
    <li><code>private</code>: absolute restriction bounded to the internal body of the class itself. Pivotal for SRP (Single Responsibility) concealing internal entropy.</li>
    <li><em>(Package-Private / Default with no keyword)</em>: Visibility limit to all classes residing in the identical logical folder sub-directory. A foundational architectural pattern where multiple classes cooperate internally but the external Service Gateway selectively exposes APIs to other folders using <code>public</code>.</li>
    <li><code>protected</code>: Replicating package-private + providing open inheritability to cross-package extensional children beyond the directory.</li>
    <li><code>public</code>: Global system exterior API. Exceptionally prone to refactoring cascades. Intense coupling. Suppress exposing domain entity behaviors recklessly.</li>
</ul>

<h2>Underlying Constructor Chaining</h2>
<p>Every constructor for any given class always executes, either implicitly or explicitly via compilation, a hidden <code>super()</code> call inside its block as the absolute first byte-code instruction. This guarantees recursively the ultimate initialization of the final god object, namely: <code>java.lang.Object</code> and every transient ancestor involved, halting desynchronized state malfunctions prior to rendering external reference pointers accessible within daughter RAM memory bounds.</p>
`
    }
];
