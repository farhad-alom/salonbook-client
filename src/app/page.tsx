import Banner from '@/components/Banner';
import Categories from '@/components/Categories';
import FeaturedServices from '@/components/FeaturedServices';
import WhyChooseUs from '@/components/WhyChooseUs';
import React from 'react';

const HomePage = () => {
  return (
    <div>

      <Banner />
      <Categories />
      <FeaturedServices />
      <WhyChooseUs />
    </div>
  );
};

export default HomePage;