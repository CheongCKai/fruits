import React, { useState } from 'react';
import { FAQAnswer, FAQContainer, FAQHeader, FAQItem, FAQQuestion } from './CustomerStyle';
import styled from 'styled-components';

const Bold = styled.span`
  font-weight: bold;
`;

const Underline = styled.span`
  text-decoration: underline;
`;

const BoldUnderline = styled.span`
  font-weight: bold;
  text-decoration: underline;
`;


const FruitFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'Where do the fruits come from?',
      answer: <span>Our fruits are sourced from various <Bold>organic</Bold> farms around the world including the <Underline>USA</Underline>, <Underline>Thailand</Underline>, and <Underline>Japan</Underline>.</span>
    },
    {
      question: 'What are the health benefits of eating fruits?',
      answer: 'Fruits are packed with essential vitamins, minerals, and antioxidants. They help boost the immune system, improve digestion, and reduce the risk of chronic diseases.'
    },
    {
      question: 'How should I store my fruits?',
      answer: 'Most fruits should be stored in a cool, dry place. Some fruits like berries and grapes should be refrigerated to keep them fresh longer.'
    },
    {
      question: 'Are the fruits organic?',
      answer: <span> <BoldUnderline>Yes,</BoldUnderline> all our fruits are certified organic and free from harmful pesticides and chemicals.</span>
    },
    {
      question: 'Can I order fruits online?',
      answer: <span><BoldUnderline>Yes,</BoldUnderline> you can easily order fruits online through our website. We offer home <Underline>delivery services</Underline> to ensure you get <Bold>fresh fruits</Bold> right at your doorstep.</span>
    }
  ];

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <FAQContainer>
      <FAQHeader>Frequently Asked Questions</FAQHeader>
      {faqs.map((faq, index) => (
        <FAQItem key={index}>
          <FAQQuestion onClick={() => handleToggle(index)}>
            {faq.question}
          </FAQQuestion>
          {activeIndex === index && <FAQAnswer>{faq.answer}</FAQAnswer>}
        </FAQItem>
      ))}
    </FAQContainer>
  );
};

export default FruitFAQ;
