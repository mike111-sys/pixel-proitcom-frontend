import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [result, setResult] = useState<string>("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setResult("Sending...");

  const formDataToSend = new FormData();
  formDataToSend.append("access_key", "YOUR_WEB3FORMS_ACCESS_KEY"); // 🔑 put your key here
  formDataToSend.append("name", formData.name);
  formDataToSend.append("email", formData.email);
  formDataToSend.append("phone", formData.phone);
  formDataToSend.append("subject", formData.subject);
  formDataToSend.append("message", formData.message);

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formDataToSend
  }).then((res) => res.json());

  if (res.success) {
    setResult("Message sent successfully!");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); // clear form
  } else {
    setResult("Something went wrong. Please try again.");
  }
};

  return (
    <>
      <div>
        <title>Contact Us | Pixel Pro Technologies</title>
        <meta name="description" content="Get in touch with Pixel Pro Technologies for inquiries, support, or partnerships. We're here to help with all your tech needs." />
      </div>

      <div className="min-h-screen bg-white text-black">
        {/* Hero Section */}
        <div className="bg-gray-50 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold mb-6 border-b-2 border-yellow-400 pb-2 inline-block">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+254 700 000 000"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaPaperPlane />
                  <span>Send Message</span>
                </button>
                 {/* ✅ Status Message */}
  {result && <p className="text-sm mt-3 text-gray-600">{result}</p>}
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 border-b-2 border-yellow-400 pb-2 inline-block">Contact Information</h2>
                <div className="space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1 text-yellow-500">
                      <FaMapMarkerAlt className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Our Location</h3>
                      <p className="text-gray-600">Koinange Street, Cianda House,</p>
                      <p className="text-gray-600">2nd Floor Suite 210, Nairobi, Kenya</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-yellow-500">
                      <FaPhone className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Phone</h3>
                      <a href="tel:+254741238738" className="text-gray-600 hover:text-yellow-500 transition-colors">
                        +254 741 238 738
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-yellow-500">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email</h3>
                      <a href="mailto:info@pixelpro.co.ke" className="text-gray-600 hover:text-yellow-500 transition-colors">
                        info@pixelpro.co.ke
                      </a>
                    </div>
                  </div>

                 
                </div>
              </div>

              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-md">
                <h3 className="text-xl font-bold mb-4 border-b-2 border-yellow-400 pb-2 inline-block">Find Us on Map</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8175139019845!2d36.8156965735005!3d-1.283350235619853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d3dd7dfc47%3A0xfd9e361041633eb7!2sCianda%20House!5e0!3m2!1sen!2ske!4v1755369264336!5m2!1sen!2ske" 
                    width="100%" 
                    height="400" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;