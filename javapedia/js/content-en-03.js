/**
 * JavaPedia — English Content (Sections 11-15) - DEEP DIVE
 */
const CONTENT_EN_03 = [
    {
        id: 'streams-lambdas', num: '11', title: 'Streams and Lambdas',
        body: `
<h2>Lambdas in Bytecode (InvokeDynamic)</h2>
<p>Prior to Java 8, simulating first-class functions necessitated instantiating "Anonymous Inner Classes", which littered the disk with loads of auxiliary <code>.class</code> files (e.g., <code>MyClass$1.class</code>), massively inflating application payload sizes and bogging down the ClassLoader.</p>
<p>With Lambdas, Java forged a revolutionary path utilizing the <strong><code>invokedynamic</code></strong> assembly instruction (originally engineered for dynamic languages like JRuby or Groovy). Instead of spawning a hardcoded class at compile time, the compiler synthesizes a hidden static method encompassing the lambda's body. During <em>runtime</em>, it invokes a CallSite that dynamically links that delegate function on-demand, aggressively bypassing useless object creation and liberating Heap memory.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// This DOES NOT generate an extra .class file. The JVM morphs it into a private static method.
Runnable modern = () -&gt; System.out.println("Hello, I am a pure function in bytes");

// Syntactic sugar shines with Functional Interfaces (@FunctionalInterface)
Predicate&lt;String&gt; isLong = str -&gt; str.length() &gt; 10;
Function&lt;String, Integer&gt; parser = Integer::parseInt; // Method Reference (Even more optimized)</code></pre></div>

<h2>Streams: "Lazy Evaluation" Architecture</h2>
<p>A Stream IS NOT a data structure. It is a <strong>Lazy Processing Pipeline</strong>. It models SQL-like queries applied flawlessly to objects resting in RAM.</p>
<p><strong>The Secret:</strong> Intermediate operations (<code>filter</code>, <code>map</code>, <code>sorted</code>) are NEVER executed when invoked. They merely blueprint an execution tree in memory. They meticulously measure and optimize logical paths. Only when a <em>Terminal Operator</em> (<code>collect</code>, <code>findFirst</code>, <code>count</code>) is decisively triggered, does the Stream engine "pull the trigger," processing the entire flow optimally in a single solitary pass over the collection.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">List&lt;String&gt; database = List.of("A1", "B2", "C3", "A4", "A5", "A6");

String result = database.stream()
    .filter(s -&gt; {
        System.out.println("Filtering: " + s); // Prints only 3 times, not 6.
        return s.startsWith("A");
    })
    .map(s -&gt; {
        System.out.println("Mapping: " + s); // Prints only 2 times.
        return s.toUpperCase();
    })
    .findFirst() // Because it is "Short-Circuiting", on the 2nd loop it finds its target and terminates the Stream.
    .orElse("Not found");
    
// Lazy evaluation saves millions of CPU cycles by categorically ignoring irrelevant downstream data
// the very millisecond the terminal goal has been accomplished.</code></pre></div>

<h2>The Peril of get() in Parallel Streams</h2>
<p>When invoking <code>.parallelStream()</code>, Java partitions the collection and blindly delegates the chunks to the JVM's global <strong>Common ForkJoinPool</strong>. Outstanding mathematical concept, yet <strong>catastrophic for web environments</strong>. If you launch a parallelStream to query an HTTP Database or execute lethargic asynchronous tasks, you will ruthlessly monopolize all core system threads, silently asphyxiating every other endpoint in your Spring Boot application attempting parallel data processing concurrently. <strong>Reserve <code>parallelStream</code> STRICTLY for localized, high-cost mathematical CPU computations (Prime Numbers, Encryption, etc).</strong></p>
`
    },
    {
        id: 'multithreading', num: '12', title: 'Multithreading and Virtual Threads',
        body: `
<h2>The Platform Paradigm (Kernel Threads)</h2>
<p>In conventional Java (prior to Java 21), a typical Java thread (<code>java.lang.Thread</code>) was architecturally bound 1:1 at the OS level to a native <strong>OS Platform Thread</strong>. Instantiating a thread mandatorily allocated ~1MB to ~2MB of RAM strictly as a Kernel Call-Stack, completely outside the Heap space.</p>
<p><strong>The Scalability Wall:</strong> Hamstrung by exorbitant RAM footprint and brutal OS Context Switching, a robust server could barely sustain 2,000 to 4,000 maximum concurrent threads. In a modern Cloud ecosystem demanding hundreds of thousands of simultaneous Websocket connections (a la NodeJS or Go), Java's classic architecture choked scaling operations to death ("One thread per HTTP request" amounted to large-scale architectural suicide).</p>

<h2>The Revolution: Project Loom & Virtual Threads (Java 21)</h2>
<p>In 2023, <strong>Java 21</strong> radically overhauled the language's innermost engine. <strong>Virtual Threads</strong> shatter the 1:1 OS confinement.</p>
<p>They are ultra-lightweight threads administered entirely by the JVM. When a Virtual Thread triggers a blocking task (for instance, idling half a second for a network API microservice to respond), the JVM automatically unmounts the Virtual Thread's state into the HEAP (Cheap global memory), dethroning it from the physical thread (Carrier Thread) in mere <em>nanoseconds</em>. The physical thread is instantaneously unblocked to serve another of the millions of incoming HTTP requests. Once the delayed data arrives, the JVM awakens that Virtual Thread from the Heap, gracefully remounts it onto a free Carrier Thread, and resumes execution seamlessly.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// A torturous benchmark that would obliterate a classic Tomcat server in 10 seconds
// Java 21+ executes this flawlessly without breaking a sweat, leveraging merely a dozen background Kernel threads.
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 5_000_000).forEach(i -&gt; {
        executor.submit(() -&gt; {
            // Sleeping suspends the VirtualThread into the Heap, yielding CPU at 100% efficiency
            Thread.sleep(Duration.ofSeconds(2)); 
            System.out.println("Task completed number: " + i);
            return i;
        });
    });
} // 5 MILLION concurrent asynchronous connections sustained relentlessly on a modest server node.</code></pre></div>

<h2>CompletableFuture vs. Imperative Programming</h2>
<p>Before Virtual Threads, conquering colossal network concurrency in Java required Reactive Asynchronous Programming (WebFlux / CompletableFutures). These tactics bypassed CPU blocking by erecting a spaghetti nightmare of chained callbacks (<i>.thenApply().thenAccept()</i>), severely crippling StackTrace legibility, log parsing, and traditional step-by-step IDE debugging.</p>
<p>Today, <strong>you script it as classical synchronous imperative code</strong> (<i>read from db</i> -&gt; <i>if null throw</i> -&gt; <i>return</i>), and hurl it inside a Virtual Thread. The code becomes trivial to comprehend and test, yielding hyper-massive scalability completely devoid of callback hell.</p>
`
    },
    {
        id: 'concurrency', num: '13', title: 'Underlying Concurrency',
        body: `
<h2>The Java Memory Model (JMM) and Visibility</h2>
<p>Modern CPUs (Intel, AMD, Apple Silicon) host multiple physical cores, where each exclusive core governs its own blazing-fast <strong>Private L1 / L2 Cache</strong> before bridging to the Motherboard's main RAM (Heap). When a Java thread executing on "Core 1" mutates a boolean <code>running = false;</code>, it strictly modifies its local L1 Cache. If a concurrent thread on "Core 4" is swirling inside a <code>while(running)</code> loop reading that identical boolean from its own isolated Cache, it will never halt. You have successfully manifested a <em>Visibility Bug</em> — an invisible critical race condition.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">public class CriticalServer {
    // The arcane keyword is VOLATILE. 
    // It triggers aggressive "Memory Barriers" at the assembly level, coercing the CPU 
    // to instantly flush all local core cache writes across the Front-Side-BUS straight to RAM.
    private volatile boolean mustStop = false;

    public void requestShutdown() {
        this.mustStop = true; // Guaranteed trans-core visibility write action
    }
}</code></pre></div>

<h2>Invasive Atomic Locks (CAS - Compare-And-Swap)</h2>
<p>The traditional <code>synchronized</code> keyword bears a flaw: It is overwhelmingly "heavy" for ridiculously rudimentary modifications like incrementing a solitary numeric counter. It employs native Mutex locks at the Operating System level. If the OS seizes control and park the CPU thread into a waiting queue, the toll is thousands of squandered clock cycles.</p>
<p>The stellar collections residing in <code>java.util.concurrent.atomic</code> (like <code>AtomicInteger</code>) bypass OS locks entirely. They leverage native <strong>Asynchronous Atomic CPU Hardware Instructions (CMPXCHG)</strong> (Compare And Swap - CAS). They optimistically attempt to overwrite the data. Should they collide with another thread, they effortlessly retry the loop in the identical nanosecond without ever surrendering or mutating their CPU thread identity.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">AtomicLong concurrentHits = new AtomicLong(0);

// Tens of thousands of belligerent threads can pound this method concurrently
public void routeImpacted() {
    // Hardware-level incrementation, completely ignoring Kernel Thread locks (Lock-Free Algorithm)
    concurrentHits.incrementAndGet(); 
}</code></pre></div>

<h2>Architectural Separation: ConcurrentHashMap</h2>
<p>Deploying <code>Collections.synchronizedMap()</code> blindly locks the entire Hash table beneath a monolithic global padlock. Any single thread reading paralyzes any thread writing. The masterful <code>ConcurrentHashMap</code> introduces <strong>Architectural Lock Striping</strong>.</p>
<p>It partitions the foundational Array Buckets into "Segments". If Thread A injects data into index 4, it exclusively locks that minute sector for milliseconds, permitting Thread B to simultaneously manipulate index 11 unhindered. Furthermore, <strong>its READ operations (<code>get</code>) ARE ENTIRELY LOCK-FREE</strong> by relying upon the underlying <code>volatile</code> mechanics of its interior Nodes, achieving abyssal multi-core limitless read throughputs.</p>
`
    },
    {
        id: 'io-nio', num: '14', title: 'Classic I/O vs NIO (Network Multiplexing)',
        body: `
<h2>The java.io Bottleneck (Blocking I/O)</h2>
<p>Armed with the ancient 1996 <code>java.io.*</code> libraries, Input and Output Streams are vehemently coupled to blocking OS mechanisms. When you invoke <code>inputStream.read()</code> from a Web Socket, the Java Thread's execution pipeline is forcibly injected into a <em>WAIT</em> state, brutally blocking the System Thread indefinitely until network frames magically flutter across the ocean wire byte-by-byte into the IP port.</p>
<p>Meanwhile, that painfully expensive server Kernel Thread (and its entirety of hogged RAM context) remains absolutely useless for half a second. Flooded with sluggish HTTP connections, you could trivially obliterate a Tomcat Server.</p>

<h2>The Submarine NIO Era: Selectors and Channels</h2>
<p>Java 1.4 deployed the <code>java.nio</code> (New I/O) package. Its core sorcery doesn't process raw Bytes but rather utilizes <strong>Bidirectional Buffers and Channels</strong>. Even more mind-boggling structurally, it implements the <strong>Event-Driven Multiplexer (Selector)</strong> pattern (Linux epoll, BSD kqueue, or Windows IOCP).</p>
<p>A multiplexer reigns as the native C++ heart upon which NodeJS and NGINX were erected. A solitary Java "Selector" Thread is stationed as a masterful hardware watchman, actively holding open an astonishing "10,000 persistent socket connections" without breaking a sweat. The Selector remains dormant. When and ONLY WHEN a network packet payload miraculously strikes TCP port 80, the network card abruptly awakens the Selector: "Hey, connection 6.452 just finished transmitting its HTTP POST headers".</p>
<p>The vigilant thread intercepts it, shunts it in colossal Direct Buffer blocks to a local Worker slave thread to execute the transactional logic.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// Zero-Copy Data Transfer natively engineered in the Kernel layer
// This is Apache Kafka's definitive secret for streaming petabytes of heavy files directly through network wires 
// without ever instantiating the memory payload onto the Java Heap and surfacing back to User-Space.

try (FileChannel origin = new FileInputStream("massive_terabyte_video.mp4").getChannel();
     FileChannel destination = new FileOutputStream("backup_video.mp4").getChannel()) {
     
    // We mandate C++ to directly issue DMA Controller directives Hard Disk to Hard Disk
    // Enormous throughput blatantly ignoring the ClassLoader. O(1) JVM Heap impact.
    origin.transferTo(0, origin.size(), destination); 

}</code></pre></div>
`
    },
    {
        id: 'modern-java', num: '15', title: 'Advanced Modern Java (14-21)',
        body: `
<h2>The Pure Immutable Design Philosophy: Records</h2>
<p>Architecturally speaking, <code>record</code> classes in Java 16+ are not merely syntactic sugar getters mirroring Project Lombok. They strictly embody "Transparent Immutable Data-Carrier Tuples" down to their bare metal core.</p>
<p>It represents a sealed final class encompassing natively hardcoded <code>private final</code> properties. During intense serialization operations (Jackson / GSON API payloads), a Record's destructurers are brutally faster and cryptographically safer because the JVM permits them to bypass specific opaque historical checks mandated by the standard Reflection API. Their deployment is strictly mandatory for molding pristine pure DTOs completely bereft of contaminated business logic ("Anemic Domain Model Data Transfer Objects").</p>

<h2>Expansive Model Security: Sealed Classes</h2>
<p>Programming history is riddled with critical security vulnerabilities spawned by savage uncontrolled inheritances. Reaching into Clean Code doctrines, <strong>Sealed Classes (Java 17)</strong> grant authoritarian API restriction hegemony to your Domain Architect. Should you publish security role classes inside your company's JAR library, you could explicitly seal that domain so absolutely NO ONE in the universe can ever extend those classes from malicious distant modules attempting to spoof security tokens by injecting "Custom" validation logics.</p>

<div class="code-block"><div class="code-header"><span class="code-lang">java</span><button class="code-copy"><i class="fas fa-copy"></i> Copy</button></div><pre><code class="language-java">// An impenetrable lockdown. No other file in the global ecosystem can implement AuthStrategy.
public sealed interface AuthStrategy permits BearerJwt, Oauth2, BasicAuth {}

public record BearerJwt(String token) implements AuthStrategy {}
public record Oauth2(String state, String challenge) implements AuthStrategy {}
public record BasicAuth(String user, char[] password) implements AuthStrategy {}
</code></pre></div>

<h2>Pattern Matching as a Finite State Automaton</h2>
<p>By wiring Records alongside Sealed Classes, the IDE compiler (Switch Expressions in Java 21+) erupts with miraculous capability (Exhaustiveness Checking). It intricately scans and detects that merely 3 finite cosmic states exist in the universe for the <code>AuthStrategy</code> interface.</p>
<p>Should a junior colleague rupture the domain by tacking on a "Fake Token" onto the Interface, yet carelessly forgets to author the corresponding charging/authorization logic inside all of your enterprise web server Switch statements, the program <strong>will categorically halt compilation worldwide instantaneously (COMPILER ERROR)</strong> issuing a severe warning: "Hey, you instituted a fourth cosmic state yet left blind execution gaps". We definitively eradicate "NullPointer" failures and Silent Polymorphism collapses, empowering flawless industrial-scale corporate growth.</p>
`
    }
];
