import { motion } from "motion/react";

const gallery = [
  { id: 1, title: "Deep Car Wash", before: "https://images.unsplash.com/photo-1597652750371-50e5015da7b5?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=400", category: "Car" },
  { id: 2, title: "Sofa Dry Cleaning", before: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400", category: "Sofa" },
  { id: 3, title: "Water Tank Cleaning", before: "https://images.unsplash.com/photo-1585802280738-f86a0d0edab3?auto=format&fit=crop&q=80&w=400", after: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400", category: "Tank" },
];

export default function BeforeAfterGallery() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-black text-black uppercase tracking-widest mb-3">Our Recent Work</h2>
            <p className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">See the Okar Ehha Difference</p>
            <p className="text-gray-500 font-medium">Real results from our latest doorstep cleaning services in Korba.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="relative h-48 md:h-56">
                <div className="absolute inset-0 flex">
                  {/* Before */}
                  <div className="w-1/2 relative border-r border-white/20">
                    <img src={item.before} alt={`${item.title} Before`} className="w-full h-full object-cover grayscale-[50%]" />
                    <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">Before</div>
                  </div>
                  {/* After */}
                  <div className="w-1/2 relative">
                    <img src={item.after} alt={`${item.title} After`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-[#25D366]/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">After</div>
                  </div>
                </div>
                {/* Center Divider line */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-gray-900 text-lg">{item.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{item.category}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
