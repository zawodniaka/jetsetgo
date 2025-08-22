'use client'
import React, {useState} from 'react';
export default function Page(){

    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "How do I book a flight?",
            answer: "On the Home page, click 'Start Planning'. Once redirected to the Booking page, select the Flights tab, enter your information, and click 'Start Booking'."
        },
        {
            question: "Can I cancel a hotel reservation?",
            answer: "Yes, cancellation policies vary. Check the booking details for specifics."
        },
        {
            question: "What payment methods are accepted?",
            answer: "We accept all major credit cards except American Express."
        }
    ]

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-3xl font-bold text-center text-gray-700">Help & Support</h1>
            <h2 className="text-2xl font-semibold mb-4 text-gray-500">Frequently Asked Questions</h2>

                {/* FAQs */}

                <section className="mb-12">
                    <div className="space-y-4">
                        {faqs.map((faq,index) => (
                            <div key={index} className="border rounded-md p-4 text-gray-400">
                                <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="text-left min-w-85 max-w-85 font-medium text-gray-800 cursor-pointer">
                                    {faq.question}
                                </button>
                                {openIndex === index && (
                                    <p className="mt-5 text-sm text-gray-600 min-w-85 max-w-85">{faq.answer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Information */}

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-gray-500">Contact Us</h2>

                    <p className="mb-4 text-gray-800">Have more questions? Send us a message:</p>

                    <form className="space-y-4 max-w-xl">
                        <div>
                            <label className="block mb-1 font-medium text-gray-800">Name</label>
                            <input type="text" required className="w-full p-2 border rounded border-gray-400 text-gray-800"/>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-800">Email</label>
                            <input type="text" required className="w-full p-2 border rounded border-gray-400 text-gray-800"/>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-800">Subject</label>
                            <input type="text" required className="w-full p-2 border rounded border-gray-400 text-gray-800"/>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium text-gray-800">Message</label>
                            <textarea required rows="5" className="w-full p-2 border rounded border-gray-400 text-gray-800"/>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
                            Send Message
                        </button>
                    </form>

                </section>

        </div>
    )
}