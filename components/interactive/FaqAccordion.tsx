'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FaqCategory } from '@/data/faqs';

interface FaqAccordionProps {
  categories: FaqCategory[];
}

export function FaqAccordion({ categories }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="faq-container">
      {categories.map((cat) => (
        <section key={cat.title} className="faq-category">
          <h2 className="faq-category-title">{cat.title}</h2>
          <div className="faq-list">
            {cat.questions.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`faq-item${isOpen ? ' active' : ''}`}
                >
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => toggle(item.id)}
                  >
                    {item.question}
                    <span className="faq-icon" aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        className="faq-answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p>{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
