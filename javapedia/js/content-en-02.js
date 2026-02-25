/**
 * JavaPedia — English Content (Sections 6-10) - DEEP DIVE
 */
const CONTENT_EN_02 = [
    {
        id: 'inheritance', num: '06', title: 'Inheritance and Domain Architecture',
        body: `
<h2>The Liskov Substitution Principle (LSP)</h2>
<p>Inheritance (extending classes) is arguably the most abused pillar in Object-Oriented Programming. Architecturally, inheritance in Java models an <strong>"Is-A"</strong> relationship. The Liskov Substitution Principle (the 'L' in S.O.L.I.D.) dictates that if a class <i>Manager</i> inherits from <i>Employee</i>, an object of type Manager must be able to replace an Employee anywhere in the code <strong>without failing and without altering the expected behavior of the program</strong>. If you override a method in the child class and throw an <code>UnsupportedOperationException</code>, you are violently violating LSP.</p>

<h2>Favoring Composition Over Inheritance</h2>
<p>In modern enterprise software design, <strong>Composition ("Has-A" relationship)</strong> is vastly preferred over Inheritance. Inheritance shatters encapsulation: the child class becomes intimately dependent on the implementation details of the parent class. If the parent changes, the child can suddenly break (The <em>Fragile Base Class</em> Problem).</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Anti-pattern: Inheritance (Is-A)
// Is an Engine a Car? NO. This unnecessarily inherits useless methods and tightly couples the code.
public class Car extends Engine { 
    public void start() { super.ignite(); }
}

// Correct Architectural Pattern: Composition (Has-A)
// A Car "has an" Engine. We delegate the logic, achieving loose coupling and allowing different engines to be injected.
public class Car {
    private final Engine engine; // Explicit and encapsulated dependency
    
    // Inversion of Control (IoC) - Receives the dependency from the outside
    public Car(Engine engine) {
        this.engine = engine;
    }
    
    public void start() {
        this.engine.ignite();
    }
}</code></pre></div>

<h2>Why Does Java Forbid Multiple State Inheritance?</h2>
<p>Unlike C++, Java does not allow a class to extend multiple base classes (<code>class A extends B, C</code>) to eradicate the dreaded <strong>Diamond Problem</strong>. If both <code>B</code> and <code>C</code> inherit from <code>Z</code> and modify a protected state variable or override the exact same method, when <code>A</code> calls that method, where should the JVM route the call in the V-Table? To keep the compiler lightning-fast and the architecture safe, Java was strictly designed to mandate single state inheritance, while allowing multiple contract implementations via <em>Interfaces</em>.</p>
`
    },
    {
        id: 'interfaces', num: '07', title: 'Interfaces and Abstract Classes: Evolution',
        body: `
<h2>The Underlying Bytecode: invokevirtual vs invokeinterface</h2>
<p>When you call a method from an Abstract Object reference variable (Class), the JVM uses the <code>invokevirtual</code> assembly instruction, which is a purely positional memory offset jump traversing the V-Table. This takes roughly 2-3 clock cycles.</p>
<p>However, when the reference variable is an <strong>Interface</strong>, the JVM does not know the actual hierarchical tree whereabouts of the object at compile time. It generates an <code>invokeinterface</code> instruction. Historically, this required executing a scan and search through the class's ITABLE (Interface Method Table) on the heap at runtime, which was notably slower. Today, the HotSpot JIT Compiler utilizes Inline Caches to annihilate this difference to near-zero in 90% of Megamorphic invocations.</p>

<h2>API Evolution: Default Methods (Java 8+)</h2>
<p>The biggest historical burden of Java until version 7 was <strong>"Backward Compatibility Hell"</strong>. If you published a library and decided to add a new mandatory method to your <code>Reader</code> interface, you forced millions of developers worldwide using your library to rewrite their code and implement that method, breaking entire build pipelines globally.</p>
<p>With <code>default methods</code>, you can gracefully <strong>evolve</strong> the interface by injecting methods loaded with a base implementation, without breaking legacy client classes that don't yet know the method exists.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public interface Repository&lt;T&gt; {
    // Strict contract (Since v1.0)
    void save(T entity);
    T findById(Long id);

    // Method injected into the API in v2.0 utilizing the power of default
    // Zero client classes implementing this interface will fail to compile!
    default void saveAll(Iterable&lt;T&gt; entities) {
        for (T entity : entities) {
            save(entity); // Calls the local abstract method, forcing consistency
        }
    }
}</code></pre></div>

<h2>Resolving Default Conflicts</h2>
<p>If a class implements two interfaces and both possess a <code>default</code> method with the <strong>exact same signature</strong>, the compiler brutally forces the class to resolve the clash manually to circumvent ambiguity, mandating an explicit override.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class AutonomousCar implements Vehicle, Drone {
    // Both Vehicle and Drone interfaces have a method: default void drive() { ... }
    
    @Override
    public void drive() {
        // You MUST explicitly choose which parent to obey, or create your own brand new logic
        Vehicle.super.drive(); // Direct routing to the parent code bypassing the current override collision
    }
}</code></pre></div>
`
    },
    {
        id: 'exceptions', num: '08', title: 'Exceptions, Hidden Costs and Anti-Patterns',
        body: `
<h2>The Hidden Cost: Stack Trace Generation</h2>
<p>Instantiating an object in Java is remarkably cheap, but <strong>instantiating an Exception is terrifyingly expensive</strong> (100 to 1000 times slower than creating a normal object). Why? When you execute <code>new Exception()</code> or <code>throw e</code>, the default constructor plunges into the native C++ code method called <code>fillInStackTrace()</code>.</p>
<p>This method instructs the JVM: "Pause the current execution thread, examine the operating system, perform a complete dump of the Call Stack, pinpoint which method called what, in what .java file, and at what exact line number, and format all of that entirely into text (String)".</p>

<div class="callout callout-warning"><div class="callout-title"><i class="fas fa-exclamation-triangle"></i> Architectural Anti-Pattern</div><strong>Exception-Driven Logic (Control Flow using Exceptions)</strong>. NEVER use try-catch blocks to govern <code>if/else</code> decisions or loop exits that happen ordinarily in your business domain (e.g., catching <code>NumberFormatException</code> just to check if a text is numeric is a criminal offense against the CPU). Use them EXCLUSIVELY for "Exceptional" and catastrophic unforeseen situations.</div>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Extreme Optimization for High-Demand Servers:
// Static exception bypassing the StackTrace
public class UserNotFoundException extends RuntimeException {
    
    // We suppress the generation of the Stack, messages, and all overhead.
    // This exception is absolutely "free" when thrown and travels instantaneously through the network edge.
    @Override
    public synchronized Throwable fillInStackTrace() {
        return this; // We intercept and nullify the exorbitant penalty of the CallStack dump
    }
}</code></pre></div>

<h2>Try-With-Resources (Under the Hood)</h2>
<p>Introduced in Java 7. Classes managing Network I/O, Databases, or Files implement the <code>AutoCloseable</code> interface. The special block blindly closes the resource even if a catastrophic exception explodes during file processing. And it executes it vastly better than you could, because it handles "Suppressed Exceptions" (when the <code>close()</code> method itself fails throwing a secondary exception overriding the original one).</p>
<p><strong>At the Bytecode level:</strong> The JVM rewrites this entire block injecting multiple hidden <code>finally</code> blocks guaranteed for you, effectively preventing Memory Leaks and File Descriptor Leaks.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Ensures no orphaned File Descriptors remain lingering in the OS
try (
    Connection conn = db.getConnection(); 
    PreparedStatement ps = conn.prepareStatement(query);
    ResultSet rs = ps.executeQuery() // Each component is opened sequentially and is AutoCloseable
) {
    while (rs.next()) {
        System.out.println(rs.getString("name"));
    }
} catch (SQLException e) {
    logger.error("DB Error, but all 3 resources were blindly CLOSED IN REVERSE ORDER automatically.", e);
}</code></pre></div>
`
    },
    {
        id: 'collections', num: '09', title: 'Collections (Big-O and HashMap Internals)',
        body: `
<h2>Big-O Analysis in Lists</h2>
<ul>
    <li><strong>ArrayList:</strong> Powered internally by a dynamic contiguous Array.
        <ul>
            <li>Reading by index <code>get(i)</code>: Staggeringly fast <strong>O(1)</strong> (L1 Cache Locality hit).</li>
            <li>Searching by value <code>contains(o)</code>: <strong>O(N)</strong> Linear (Worst case scenario).</li>
            <li>Insertion <code>add()</code>: <strong>Amortized O(1)</strong>. When it internally fills up, it allocates a brand new Array 50% (1.5x) larger and copies the entire memory block via raw native C bindings (<code>System.arraycopy</code>).</li>
        </ul>
    </li>
    <li><strong>LinkedList:</strong> Doubly-linked pointers scattered chaotically across the entire Heap.
        <ul>
            <li>Reading by index <code>get(i)</code>: Slow <strong>O(N)</strong>, heavily punished by Heap Fragmentation Cache Misses.</li>
            <li>Insertion at extremes (Head/Tail): Constant <strong>O(1)</strong> and geometrically flawless for pure Queues.</li>
        </ul>
    </li>
</ul>

<h2>Diving into the Core of HashMap</h2>
<p>The <code>HashMap</code> is arguably the top 3 most crucial data structures in the entire language. Architecturally, it is a traditional Array composed of cells called <strong>"Buckets"</strong>. By default, it initializes with 16 buckets. It wields a mathematical Hash function to decipher exactly which index to jump to.</p>

<h3>Insertion Flow (Put):</h3>
<ol>
    <li>You invoke <code>map.put(K, V)</code>.</li>
    <li>The map calls <code>K.hashCode()</code>.</li>
    <li>It applies an extra XOR bitwise mathematical perturbation (Right shifting the hashcode) to mitigate dense collisions when the array length is tiny.</li>
    <li>It performs the bitwise operation <code>(n - 1) &amp; hash</code> (the ultra-fast equivalent of <code>hash % arrayCapacity</code>) to ascertain the exact index from 0 to 15 of the local destination Bucket. <strong>This calculation is unequivocally O(1)</strong>.</li>
    <li>It drops the Data Payload into a <em>Node (Map.Entry)</em> hovering at that index slot.</li>
</ol>

<h3>Random Collisions and Treeification (Java 8+)</h3>
<p>If the math dictates identical Buckets for two disparate keys, a Collision occurs. In Java 7, the Bucket unilaterally mutated into a plain LinkedList, cascading appending objects. The danger with the Denial of Service attack (Hash DoS), is that a malicious attacker can forge millions of malicious strings mathematically architected to point specifically to Bucket 0. The once pristine O(1) HashMap drastically degraded to crawling through a list in O(N), managing to cripple a Xeon server core in mere seconds.</p>
<p><strong>The Architectural Solution (Treeification):</strong> In Java 8, if a collision transpires inside the same Bucket cell and that particular LinkedList hits a static threshold of length = 8 objects, the JVM locally morphs that Bucket's list and dynamically rebalances it into a <strong>Red-Black Binary Tree</strong> in real-time. Execution performance gracefully downgrades seamlessly to an extraordinarily resistant <strong>O(log N)</strong>, neutralizing any attempt at algorithmic saturation hacking.</p>

<h3>The Load Factor</h3>
<p>The default standard is <code>0.75</code>. It implies that, out of the initial 16 slots, when the collection crosses 75% capacity (spanning 12 items), it automatically triggers a <strong>massive global Re-Hash procedure</strong> duplicating the array's memory into 32 slots (vital to safely maintain fast bitwise math and scarce collisions). It's paramount for enormous API operations to initialize hash maps with a surgically calculated capacity using: <code>new HashMap&lt;&gt;(expectedElements / 0.75 + 1)</code>.</p>
`
    },
    {
        id: 'generics', num: '10', title: 'Generics (Type Erasure & Heap Pollution)',
        body: `
<h2>The Hidden Secret: Type Erasure</h2>
<p>When Sun Microsystems injected diamond operator support (Generics) into Java 1.5 back in 2004, they confronted a monumental engineering dilemma: the millions of banking systems running on Java 1.4 had to be able to instantly load Java 5.0 binaries on the same machine without triggering a catastrophic meltdown. They consciously opted for strict backward compatibility over native architecture reconstruction.</p>
<p><strong>Type Erasure</strong> intrinsically means that Generics in Java <strong>do not exist at all during JVM runtime</strong> (Contrary to C++ templates or Reified Generics in C#).</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Glorified Source code rendered in the IDE
List&lt;String&gt; strings = new ArrayList&lt;&gt;();
strings.add("Architecture");
String value = strings.get(0);

// JAVAC COMPILER MAGIC (What is literally rendered into bytecode after compiling)
List nakedStrings = new ArrayList(); // Deletes the type (Raw Type Erasure)
nakedStrings.add("Architecture");
// And the compiler stealthily injects forced manual CASTS on your behalf blindly
String extractedValue = (String) nakedStrings.get(0);</code></pre></div>

<p>At the byte-code level mapped on the RAM, every single list eternally manages raw pointers to plain <code>Object</code>. The syntactic sugar lies solely in enforcing cast checks enforced by the IDE development compiler. This physically bounds certain actions, for instance answering <code>if (list instanceof List&lt;String&gt;)</code>: it is impossible to ask that question at the binary level because the 'String' metric was already annihilated from the underlying RAM byte-code, it just survives as an <code>instanceof List</code>.</p>

<h2>Heap Pollution (Memory Toxification)</h2>
<p>Given that the executing JVM possesses zero clue regarding the intended typing of an ArrayList armed with Generics during runtime, the Dangerous Architecture mechanism known as <em>Heap Pollution</em> emerges: Synthesizing modern code (Java 5+) alongside obsolete Legacy libraries and successfully deceiving the system, ultimately triggering an unexpected ClassCastException in a distant, unrelated file that completely baffles the programmer months later.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public static void hackSecureList() {
    // 1. A junior developer deploying recent best practices compiles this:
    List&lt;String&gt; securedList = new ArrayList&lt;&gt;();

    // 2. The reference is injected into a reckless old Legacy library (A 1999 JAR with no generic tracking):
    injectMalice(securedList); 

    // 4. LATE FATAL EXPLOSIVE ClassCastException!!
    // Java attempts to cast the Object retrieved into a String and discovers an airplane mid-flight inside the program.
    String extracted = securedList.get(0); 
}

public static void injectMalice(List preJava5Library) { // Exploits raw code (Raw Type)
    // 3. This block bypasses the compiler completely and funnels an Integer straight into the String generics, passing compile checks flawlessly.
    preJava5Library.add(Integer.valueOf(666)); 
}</code></pre></div>

<h2>Bounded Wildcards (Upper & Lower Bounds)</h2>
<p>Generics in Java <strong>Are Invariant</strong>. (A <code>List&lt;Dog&gt;</code> is NOT a subtype of <code>List&lt;Animal&gt;</code>).</p>
<p>If the above statement wasn't true, someone could illegally force a Cat inside your Dogs List by merely casting upwards to the Animal Parent wrapper. But to architect generic APIs, we require massive structural flexibility. This is why we deploy WildCards adopting the strict <strong>P.E.C.S</strong> principle methodology.</p>
<ul>
    <li><code>&lt;? extends T&gt;</code>: <strong>Producer Extends.</strong> For methods that strictly read or pull values OUT of the collection. The compiler completely blocks all additions or inclusions avoiding destructive polymorphic accidents.</li>
    <li><code>&lt;? super T&gt;</code>: <strong>Consumer Super.</strong> For methods that strictly process and force specific values IN to a general list, preventing write corruptions across distant relational cousin trees.</li>
</ul>
`
    }
];
