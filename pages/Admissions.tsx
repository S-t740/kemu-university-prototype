import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, FileText, Send, CreditCard, ExternalLink, Award, DollarSign, Globe, Download, Calendar, Clock, GraduationCap, ArrowRight } from 'lucide-react';
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
    { title: 'Choose Program', desc: 'Explore our undergraduate and postgraduate courses.', icon: <FileText size={24} /> },
    { title: 'Check Requirements', desc: 'Review academic and document requirements.', icon: <CheckCircle size={24} /> },
    { title: 'Submit Application', desc: 'Fill out the online application form.', icon: <Send size={24} /> },
    { title: 'Pay Fee', desc: 'Process the non-refundable application fee.', icon: <CreditCard size={24} /> },
  ];

  const timelineSteps = [
    { title: 'Application Opens', desc: 'Submit online', month: 'Jan, May, Sep' },
    { title: 'Document Review', desc: 'We review your docs', month: '2 weeks' },
    { title: 'Interview', desc: 'If required', month: 'As scheduled' },
    { title: 'Decision', desc: 'Receive admission letter', month: '4 weeks' },
  ];

  return (
    <div className="min-h-screen bg-kemu-purple10">
      {/* Compact Hero Section */}
      <div className="relative h-[45vh] min-h-[350px] overflow-hidden">
        {/* Video Slide */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${activeSlide === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <video ref={videoRef} autoPlay muted playsInline onEnded={handleVideoEnded} className="w-full h-full object-fill">
            <source src="/january-intake.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Image Slide */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${activeSlide === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <img src="/kemu-university.jpg" alt="KeMU Campus" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-kemu-purple/85 via-kemu-purple/75 to-kemu-blue/85"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-white drop-shadow-lg">Admissions</h1>
            <p className="text-base md:text-lg text-white/90">Your journey to excellence starts here. Follow these simple steps to join KeMU.</p>
          </div>
          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${activeSlide === index ? 'bg-kemu-gold w-6' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Compact Step Cards - Horizontal Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-xl p-5 rounded-xl shadow-soft-3d border-t-3 border-kemu-gold relative group hover:-translate-y-1 transition-all">
              <div className="absolute top-3 right-3 text-gray-100 font-bold text-4xl">{index + 1}</div>
              <div className="text-kemu-purple mb-3 bg-kemu-purple10 w-12 h-12 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-1 font-serif">{step.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout: Apply + Scholarship */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {/* Ready to Apply Card */}
          <div className="bg-gradient-to-br from-kemu-blue to-kemu-purple rounded-xl shadow-deep-3d p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap size={28} className="text-kemu-gold" />
              <h3 className="text-xl font-serif font-bold">Ready to Apply?</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              KeMU offers PhD, Masters, Degree, Diploma, and Certificate programmes. Intakes: January, May, September.
            </p>
            <ul className="space-y-1.5 mb-5 text-sm">
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-kemu-gold" />Copy of National ID / Passport</li>
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-kemu-gold" />KCSE Result Slip / Certificate</li>
              <li className="flex items-center"><CheckCircle size={14} className="mr-2 text-kemu-gold" />Passport sized photos</li>
            </ul>
            <Link
              to="/student-apply"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-kemu-gold to-yellow-500 
                text-white font-bold rounded-xl shadow-glow-gold hover:shadow-deep-3d 
                transition-all duration-300 hover:-translate-y-0.5"
            >
              <ArrowRight size={18} />
              Apply Now Online
            </Link>
          </div>

          {/* Scholarship Card */}
          <div className="bg-gradient-to-br from-kemu-purple to-kemu-blue rounded-xl shadow-deep-3d p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Award size={28} className="text-kemu-gold" />
              <h3 className="text-xl font-serif font-bold">Bless to Bless Scholarship</h3>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              Scholarships and grants that do not have to be repaid. Available for qualifying students.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-bold mb-2 flex items-center gap-1"><DollarSign size={14} className="text-kemu-gold" />Requirements</h4>
                <ul className="space-y-1 text-blue-100">
                  <li>• Full-time student (12+ pts)</li>
                  <li>• Applied for aid on time</li>
                  <li>• Meeting SAP standards</li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <h4 className="font-bold mb-2 flex items-center gap-1"><Clock size={14} className="text-kemu-gold" />Contact</h4>
                <p className="text-blue-100">Mon-Fri, 8am-5pm</p>
                <p className="text-blue-100">+254724256162</p>
                <p className="text-blue-100">info@kemu.ac.ke</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline + Documents - Side by Side */}
        <div className="grid lg:grid-cols-5 gap-6 mb-10">
          {/* Compact Timeline */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-serif font-bold text-kemu-purple mb-4">Admissions Timeline</h2>
            <div className="bg-white/90 backdrop-blur-xl rounded-xl p-5 shadow-soft-3d">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-kemu-gold rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2 shadow-glow-gold">
                      {index + 1}
                    </div>
                    <h4 className="text-sm font-bold text-kemu-purple mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-600 mb-1">{step.desc}</p>
                    <p className="text-xs text-kemu-gold font-semibold">{step.month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-serif font-bold text-kemu-purple mb-4">Documents</h2>
            <div className="space-y-3">
              {[
                { title: 'Academic Handbook', icon: FileText },
                { title: 'Scholarship Guide', icon: Award },
                { title: 'Academic Calendar', icon: Calendar },
              ].map((doc, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-xl rounded-lg p-4 shadow-soft-3d flex items-center gap-3 group cursor-pointer hover:shadow-deep-3d transition-all">
                  <div className="p-2 bg-kemu-purple10 rounded-lg">
                    <doc.icon size={20} className="text-kemu-purple" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 flex-1">{doc.title}</span>
                  <Download size={18} className="text-gray-400 group-hover:text-kemu-gold transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Info - Compact Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {getAdmissions().filter(item => item.title !== 'Apply to KeMU').map((item, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-xl rounded-xl p-5 shadow-soft-3d">
              <div className="flex items-center gap-2 mb-3">
                {item.title === 'International Students' && <Globe size={20} className="text-kemu-purple" />}
                {item.title === 'KUCCPS' && <FileText size={20} className="text-kemu-purple" />}
                {item.title === 'Enquiry' && <Send size={20} className="text-kemu-purple" />}
                <h3 className="text-lg font-serif font-bold text-kemu-blue">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admissions;