import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, FileText, Send, CreditCard, ExternalLink, Award, DollarSign, Globe, Download, Calendar, Clock, GraduationCap } from 'lucide-react';
import { getAdmissions, getStudentServices } from '../utils/contentLoader';
import { GoldButton, GlassSection } from '../components';

const Admissions: React.FC = () => {
  // Hero transition state
  const [activeSlide, setActiveSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slides = ['video', 'image'];

  // Handle video end - transition to image slide
  const handleVideoEnded = () => {
    setActiveSlide(1); // Switch to image
  };

  // When image slide is active, wait 5 seconds then go back to video
  useEffect(() => {
    if (activeSlide === 1) {
      const timer = setTimeout(() => {
        setActiveSlide(0);
        // Restart video when coming back
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play();
        }
      }, 5000); // Show image for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [activeSlide]);

  const steps = [
    {
      title: 'Choose Your Program',
      desc: 'Explore our wide range of undergraduate and postgraduate courses to find your perfect fit.',
      icon: <FileText size={32} />
    },
    {
      title: 'Check Requirements',
      desc: 'Review the academic and document requirements specific to your chosen course.',
      icon: <CheckCircle size={32} />
    },
    {
      title: 'Submit Application',
      desc: 'Create an account on our portal and fill out the online application form.',
      icon: <Send size={32} />
    },
    {
      title: 'Pay Application Fee',
      desc: 'Process the non-refundable application fee via mobile money or bank transfer.',
      icon: <CreditCard size={32} />
    },
  ];

  return (
    <div className="min-h-screen bg-kemu-purple10">
      {/* Custom Transitioning Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {/* Video Slide */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${activeSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="w-full h-full object-fill"
          >
            <source src="/january-intake.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Image Slide */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${activeSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
        >
          <img
            src="/kemu-university.jpg"
            alt="KeMU Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple/85 via-kemu-purple/75 to-kemu-blue/85"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center container mx-auto px-4">
          <div className="max-w-3xl animate-fade-up">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight drop-shadow-lg text-white">
              Admissions
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/90 drop-shadow-md">
              Your journey to excellence starts here. Follow these simple steps to join the KeMU community.
            </p>
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSlide === index
                  ? 'bg-kemu-gold w-8'
                  : 'bg-white/50 hover:bg-white/80'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Glass Step Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card bg-white/90 backdrop-blur-xl p-8 rounded-xl shadow-soft-3d hover:shadow-deep-3d border-t-4 border-kemu-gold relative overflow-hidden group transition-all duration-300 hover:-translate-y-2 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute top-4 right-4 text-gray-100 font-bold text-6xl -z-0 group-hover:text-kemu-purple10 transition-colors">{index + 1}</div>
              <div className="relative z-10">
                <div className="text-kemu-purple mb-4 bg-kemu-purple10 w-16 h-16 rounded-full flex items-center justify-center shadow-soft-3d">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 font-serif">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Ready to Apply - 3D Card */}
        <div className="glass-card bg-white/95 backdrop-blur-xl rounded-xl shadow-deep-3d overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto mb-16 animate-fade-up">
          <div className="md:w-1/2 bg-gradient-to-br from-kemu-blue to-kemu-purple p-10 text-white flex flex-col justify-center">
            <h3 className="text-2xl font-serif font-bold mb-4">Ready to Apply?</h3>
            <p className="mb-6 text-blue-100">
              Kenya Methodist University offers PhD, Masters, Degree, Diploma, and Certificate programmes. Our intakes are in January, May, and September. Ensure you have your academic transcripts and ID ready before starting your application.
            </p>
            <ul className="space-y-2 mb-8 text-sm">
              <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" /> Copy of National ID / Passport</li>
              <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" /> KCSE Result Slip / Certificate</li>
              <li className="flex items-center"><CheckCircle size={16} className="mr-2 text-kemu-gold" /> Passport sized photos</li>
            </ul>
            <GoldButton
              href="https://admissions.kemu.ac.ke/"
              icon={ExternalLink}
            >
              Go to Application Portal
            </GoldButton>
          </div>
          <div className="md:w-1/2 min-h-[300px] bg-gradient-to-br from-kemu-purple10 to-kemu-purple30 flex items-center justify-center">
            <GraduationCap size={120} className="text-kemu-purple/20" />
          </div>
        </div>

        {/* Scholarships Section - Gold Glow */}
        <div className="mt-16 glass-card bg-gradient-to-r from-kemu-blue to-kemu-purple rounded-xl shadow-deep-3d overflow-hidden animate-fade-up glow-pulse">
          <div className="p-10 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award size={32} className="text-kemu-gold" />
              <h2 className="text-3xl font-serif font-bold">Bless to Bless Scholarship Program</h2>
            </div>
            <p className="text-lg text-blue-100 mb-6 max-w-3xl">
              Kenya Methodist University offers a variety of scholarships and fellowships designed to help you and your family pay for university. Scholarships and grants are types of gift aid that do not have to be repaid.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="glass-light bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 font-serif">
                  <DollarSign size={24} className="text-kemu-gold" />
                  Requirements
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-kemu-gold mt-1 flex-shrink-0" /> You are a full-time student (at least 12 points)</li>
                  <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-kemu-gold mt-1 flex-shrink-0" /> You applied for financial aid on time</li>
                  <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-kemu-gold mt-1 flex-shrink-0" /> You are meeting the Satisfactory Academic Progress standards</li>
                  <li className="flex items-start"><CheckCircle size={16} className="mr-2 text-kemu-gold mt-1 flex-shrink-0" /> You have approximately the same amount of financial need that you had in prior years</li>
                </ul>
              </div>
              <div className="glass-light bg-white/10 backdrop-blur-xl rounded-lg p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4 font-serif">Contact Information</h3>
                <p className="text-sm text-blue-100 mb-4 flex items-center gap-2">
                  <Clock size={16} /> Office Hours: Monday – Friday, 8am – 5pm (except holidays)
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Phone:</strong> +254724256162</p>
                  <p><strong>Email:</strong> info@kemu.ac.ke</p>
                  <p className="mt-4"><strong>Addresses:</strong></p>
                  <p className="text-xs">P.O. Box 267 – 60200, Meru, Kenya</p>
                  <p className="text-xs">P.O. Box 45240 – 00100, Nairobi, Kenya</p>
                  <p className="text-xs">P.O. Box 89983 – 80100, Mombasa, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admissions Timeline */}
        <div className="mt-16 mb-10">
          <h2 className="section-title font-serif text-center">Admissions Timeline</h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-kemu-gold"></div>

              {[
                { title: 'Application Opens', desc: 'Submit your application online', month: 'January, May, September' },
                { title: 'Document Review', desc: 'We review your documents', month: 'Within 2 weeks' },
                { title: 'Interview (if required)', desc: 'Some programs require interviews', month: 'As scheduled' },
                { title: 'Admission Decision', desc: 'Receive your admission letter', month: 'Within 4 weeks' },
              ].map((step, index) => (
                <div key={index} className="relative mb-8 pl-20 animate-fade-up" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="absolute left-0 top-0 w-16 h-16 bg-kemu-gold rounded-full flex items-center justify-center shadow-glow-gold border-4 border-white">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="glass-card bg-white/90 backdrop-blur-xl">
                    <h3 className="text-xl font-bold text-kemu-purple mb-2 font-serif">{step.title}</h3>
                    <p className="text-gray-600 mb-2">{step.desc}</p>
                    <p className="text-sm text-kemu-gold font-semibold flex items-center gap-2">
                      <Calendar size={16} />
                      {step.month}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Downloadables - 3D File Cards */}
        <div className="mt-16">
          <h2 className="section-title font-serif text-center mb-8">Important Documents</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Academic Handbook', icon: FileText, desc: 'Complete guide to academic policies' },
              { title: 'Scholarship Guide', icon: Award, desc: 'Information about available scholarships' },
              { title: 'Academic Calendar', icon: Calendar, desc: 'Important dates and deadlines' },
            ].map((doc, index) => (
              <div
                key={index}
                className="program-card group cursor-pointer animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-kemu-purple10 rounded-lg">
                    <doc.icon size={24} className="text-kemu-purple" />
                  </div>
                  <Download size={20} className="text-gray-400 group-hover:text-kemu-gold ml-auto transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-kemu-purple mb-2 font-serif">{doc.title}</h3>
                <p className="text-gray-600 text-sm">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Admissions Information */}
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {getAdmissions().filter(item => item.title !== 'Apply to KeMU').map((item, index) => (
            <GlassSection key={index} variant="light" className="bg-white/90 backdrop-blur-xl animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-4">
                {item.title === 'International Students' && <Globe size={24} className="text-kemu-purple" />}
                {item.title === 'KUCCPS' && <FileText size={24} className="text-kemu-purple" />}
                {item.title === 'Enquiry' && <Send size={24} className="text-kemu-purple" />}
                <h2 className="text-2xl font-serif font-bold text-kemu-blue">{item.title}</h2>
              </div>
              <p className="text-gray-700 mb-4">{item.summary}</p>
              {item.details && item.details.length > 0 && (
                <ul className="space-y-2 text-sm text-gray-600">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle size={16} className="mr-2 text-kemu-gold mt-1 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              )}
            </GlassSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admissions;