
async function run() {
  const ip = '2406:da1a:82a:9d01:8549:879c:3229:3d3c';
  console.log('Fetching AWS IP ranges...');
  try {
    const res = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
    const data = await res.json();
    console.log(`Found ${data.ipv6_prefixes.length} IPv6 prefixes.`);
    
    // We want to parse the IPv6 address to find which prefix contains it
    // A simple match can check if the prefix starts with "2406:da1a:" or similar
    const matches = data.ipv6_prefixes.filter(p => {
      const parts = p.ipv6_prefix.split(':');
      // e.g. prefix is "2406:da1a:800::/40"
      // check if it matches our IP
      // Our IP starts with "2406:da1a:82a"
      return p.ipv6_prefix.startsWith('2406:da1a:');
    });
    
    console.log('Matching prefixes:');
    console.log(JSON.stringify(matches, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
