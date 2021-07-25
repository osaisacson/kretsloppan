import React from 'react';
import { pure } from 'recompose';
import CardBottomInfo from './CardBottomInfo';
import CardTouchable from './CardTouchable';

const ProjectItem = ({ onSelect, itemData, cardHeight, hideInfo }) => {
  const { image, title, description } = itemData;

  const underCardInfoComponent = !hideInfo ? (
    <CardBottomInfo title={title} description={description} />
  ) : null;

  return (
    <CardTouchable
      hideInfo={hideInfo}
      image={image}
      cardHeight={cardHeight}
      onSelect={onSelect}
      underCardInfo={underCardInfoComponent}
    />
  );
};

export default pure(ProjectItem);
