
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.scss';

function Home({ links }) {
   return (
      <div className={s.root}>
         <div className={s.container}>
            <h1 className={s.title}>HoomanLogic Home</h1>
            <ul className={s.news}>
               {links.map((item, index) => (
                  <li key={index} className={s.newsItem}>
                     <a href={item.link} className={s.newsTitle}>{item.title}</a>
                  </li>
               )) }
            </ul>
         </div>
      </div>
   );
}

Home.propTypes = {
   links: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
   })).isRequired,
};

export default withStyles(Home, s);
