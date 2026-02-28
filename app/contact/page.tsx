"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaXTwitter } from "react-icons/fa6";

export default function ContactPage() {
  const [category, setCategory] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Handle URL hash for pre-filling category
  useEffect(() => {
    const hash = window.location.hash;
    const categoryMap: Record<string, string> = {
      "#support-form": "support",
      "#sales-form": "sales",
      "#feedback-form": "feedback",
    };
    if (categoryMap[hash]) {
      setCategory(categoryMap[hash]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Maximum size is 10MB.");
      e.target.value = "";
      return;
    }
    setSelectedFile(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const data = {
      category,
      firstName,
      lastName,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMsg("Message sent!");
        setCategory("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setSelectedFile("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setErrorMsg(
          "Failed to send message. Please try again or email us directly.",
        );
      }
    } catch {
      setErrorMsg(
        "Something went wrong. Please email us at hello@234grammar.com",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="">
            <Image
              src={"/logo/logo_black.svg"}
              alt="Logo"
              width={50}
              height={50}
              className="w-40"
            />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-primary transition hidden md:inline"
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-primary transition hidden md:inline"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-primary transition hidden md:inline"
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primaryHover transition font-semibold"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="bg-linear-to-br from-green-50 to-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 fade-in">
            We&apos;re here to help. Choose the best way to reach us below.
          </p>

          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            <span>We typically respond within 24 hours</span>
          </div>
        </div>
      </section>

      {/* CONTACT OPTIONS */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Support */}
            <a
              href="#support-form"
              onClick={() => setCategory("support")}
              className="bg-linear-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8 hover:border-primary hover:shadow-lg transition text-center group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition">
                <svg
                  className="w-8 h-8 text-blue-600 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Having trouble? We&apos;re here to help
              </p>
              <span className="text-primary font-semibold text-sm">
                Get Help →
              </span>
            </a>

            {/* Sales */}
            <a
              href="#sales-form"
              onClick={() => setCategory("sales")}
              className="bg-linear-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-8 hover:border-primary hover:shadow-lg transition text-center group"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition">
                <svg
                  className="w-8 h-8 text-green-600 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Sales &amp; Enterprise</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bulk licenses or custom plans
              </p>
              <span className="text-primary font-semibold text-sm">
                Contact Sales →
              </span>
            </a>

            {/* Feedback */}
            <a
              href="#feedback-form"
              onClick={() => setCategory("feedback")}
              className="bg-linear-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-8 hover:border-primary hover:shadow-lg transition text-center group"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition">
                <svg
                  className="w-8 h-8 text-purple-600 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Feedback</h3>
              <p className="text-sm text-gray-600 mb-4">
                Feature requests or suggestions
              </p>
              <span className="text-primary font-semibold text-sm">
                Share Ideas →
              </span>
            </a>

            {/* Press */}
            <a
              href="mailto:press@234grammar.com"
              className="bg-linear-to-br from-orange-50 to-white border-2 border-orange-100 rounded-2xl p-8 hover:border-primary hover:shadow-lg transition text-center group"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition">
                <svg
                  className="w-8 h-8 text-orange-600 group-hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Press &amp; Media</h3>
              <p className="text-sm text-gray-600 mb-4">
                Journalists and media inquiries
              </p>
              <span className="text-primary font-semibold text-sm">
                press@234grammar.com
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* MAIN CONTACT FORM */}
      <section id="contact-form" className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* LEFT: CONTACT FORM */}
            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border-2 border-gray-100">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>

                {/* Success Message */}
                {successMsg && (
                  <div
                    ref={successRef}
                    className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-600 mr-2 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-green-800">
                          Message Sent!
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          We&apos;ll get back to you within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMsg && (
                  <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg
                        className="w-5 h-5 text-red-600 mr-2 shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-800">
                          Something went wrong
                        </p>
                        <p className="text-sm text-red-700 mt-1">{errorMsg}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold mb-2"
                    >
                      What can we help you with?
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                    >
                      <option value="">Select a category</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing &amp; Payments</option>
                      <option value="sales">Sales &amp; Enterprise</option>
                      <option value="feedback">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="partnership">Partnership</option>
                      <option value="press">Press &amp; Media</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Name */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    x.com
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold mb-2"
                    >
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      placeholder="Brief description of your inquiry"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      placeholder="Tell us more about your question or feedback..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Please include as much detail as possible
                    </p>
                  </div>

                  {/* File Attachment */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Attachment (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition">
                      <input
                        type="file"
                        id="attachment"
                        ref={fileInputRef}
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="attachment" className="cursor-pointer">
                        <svg
                          className="w-10 h-10 mx-auto mb-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className="text-sm text-gray-600">
                          <span className="text-primary font-semibold">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, PDF up to 10MB
                        </p>
                      </label>
                      {selectedFile && (
                        <p className="mt-3 text-sm text-gray-700">
                          Selected: {selectedFile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primaryHover transition shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span>Sending...</span>
                        <span className="spinner ml-3" />
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: CONTACT INFO & FAQ */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Email Us</div>
                      <a
                        href="mailto:hello@234grammar.com"
                        className="text-primary hover:underline"
                      >
                        hello@234grammar.com
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        General inquiries &amp; support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">
                        Technical Support
                      </div>
                      <a
                        href="mailto:support@234grammar.com"
                        className="text-primary hover:underline"
                      >
                        support@234grammar.com
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Response within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Office Location</div>
                      <p className="text-gray-700">Lagos, Nigeria 🇳🇬</p>
                      <p className="text-sm text-gray-600 mt-1">
                        West Africa&apos;s tech hub
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold mb-1">Social Media</div>
                      <div className="space-y-1">
                        <a
                          href="https://x.com/234grammar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline"
                        >
                          Twitter/X @234grammar
                        </a>
                        <a
                          href="https://linkedin.com/company/234grammar"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-primary hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
                <h3 className="text-2xl font-bold mb-6">Quick Answers</h3>

                <div className="space-y-4">
                  {[
                    {
                      q: "How fast do you respond?",
                      a: "We aim to respond to all inquiries within 24 hours during business days. Pro users get priority support.",
                      border: false,
                    },
                    {
                      q: "Can I request a feature?",
                      a: 'Absolutely! Select "Feature Request" above and tell us what you\'d like to see. We read every suggestion.',
                      border: true,
                    },
                    {
                      q: "Need urgent help?",
                      a: 'Email support@234grammar.com with "URGENT" in the subject line.',
                      border: true,
                    },
                    {
                      q: "Looking for bulk licenses?",
                      a: 'Select "Sales & Enterprise" above or email sales@234grammar.com for custom pricing and dedicated support.',
                      border: true,
                    },
                  ].map(({ q, a, border }) => (
                    <details key={q} className="group">
                      <summary
                        className={`flex items-center justify-between cursor-pointer font-semibold py-2 ${border ? "border-t pt-4" : ""}`}
                      >
                        <span>{q}</span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-open:rotate-180 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <p className="text-sm text-gray-600 mt-2 pl-4">{a}</p>
                    </details>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Link
                    href="/#faq"
                    className="text-primary font-semibold hover:underline flex items-center gap-2"
                  >
                    View all FAQs
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Response Time Info */}
              <div className="bg-linear-to-br from-green-50 to-white border-2 border-green-100 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <svg
                    className="w-8 h-8 text-green-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4 className="font-bold mb-2">Response Times</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-gray-700">
                          <strong>Support:</strong> Within 24 hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-gray-700">
                          <strong>Sales:</strong> Within 12 hours
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span className="text-gray-700">
                          <strong>Press:</strong> Within 48 hours
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      Monday - Friday, 9 AM - 6 PM WAT
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALTERNATIVE CONTACT METHODS */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Other Ways to Reach Us
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the method that works best for you
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* <Link
              href="/help"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="font-bold text-lg mb-2">Help Center</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse guides, tutorials, and documentation
              </p>
              <span className="text-primary font-semibold text-sm">
                Visit Help Center →
              </span>
            </Link> */}

            <a
              href="https://x.com/234grammar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <FaXTwitter
                className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition"
                />
              <h3 className="font-bold text-lg mb-2">X/Twitter Community</h3>
              <p className="text-sm text-gray-600 mb-4">
                Join conversations and get quick answers
              </p>
              <span className="text-primary font-semibold text-sm">
                Follow @234grammar →
              </span>
            </a>

            <a
              href="https://calendly.com/234grammar"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-8 border-2 border-gray-100 hover:border-primary transition group"
            >
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-400 group-hover:text-primary transition"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-bold text-lg mb-2">Schedule a Call</h3>
              <p className="text-sm text-gray-600 mb-4">
                Book a time with our team (Enterprise only)
              </p>
              <span className="text-primary font-semibold text-sm">
                Book Meeting →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white text-lg font-bold mb-4">234Grammar</h4>
              <p className="text-sm">
                Built for Nigerian &amp; West African English.
              </p>
              <p className="text-sm mt-2">Made with 💚 in Lagos, Nigeria</p>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/#features"
                    className="hover:text-white transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#pricing"
                    className="hover:text-white transition"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/#faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition">
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:support@234grammar.com"
                    className="hover:text-white transition"
                  >
                    support@234grammar.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 234Grammar. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="https://twitter.com/234grammar"
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/234grammar"
                className="hover:text-white transition"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
