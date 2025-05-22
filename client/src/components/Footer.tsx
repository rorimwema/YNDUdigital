import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-heading font-bold text-white mb-4">YNDU FOUNTAIN</div>
            <p className="mb-6">Small Farms. Big Ideas.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#produce" className="hover:text-white transition-colors">Our Produce</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Farm Features</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-3" size={18} />
                <span>Kibwezi, Kenya</span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-3" size={18} />
                <span>+254 XXX XXX XXX</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-3" size={18} />
                <span>info@yndufountain.co.ke</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2">
              <li>Monday - Friday: 8AM - 5PM</li>
              <li>Saturday: 9AM - 1PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-12 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Yndu Fountain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
