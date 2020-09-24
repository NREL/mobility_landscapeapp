import React from "react";
import Fade from "@material-ui/core/Fade";
import settings from 'project/settings.yml'
import fields from "../../types/fields";
import {
  largeItemHeight,
  largeItemWidth,
  smallItemHeight,
  smallItemWidth
} from "../../utils/landscapeCalculations";

const LargeItem = (({ item, onSelectItem, isMember }) => {
  const relationInfo = fields.relation.values.find(({ id }) => id === item.relation);
  const color = relationInfo.big_picture_color;
  const label = relationInfo.big_picture_label;
  const textHeight = isMember ? 0 : 10
  const padding = 2

  return <div style={{
    cursor: 'pointer',
    position: 'relative',
    background: color,
    visibility: item.isVisible ? 'visible' : 'hidden',
    width: largeItemWidth,
    height: largeItemHeight }}
              onClick={ () => onSelectItem(item.id)}
  >
    <img loading="lazy" src={item.href} style={{
      width: `calc(100% - ${2 * padding}px)`,
      height: `calc(100% - ${2 * padding + textHeight}px)`,
      padding: 5,
      margin: `${padding}px ${padding}px 0 ${padding}px`,
    }} data-href={item.id} alt={item.name} />
    <div style={{position: 'absolute', bottom: 0, width: '100%', height: textHeight + padding, textAlign: 'center', verticalAlign: 'middle', background: color, color: 'white', fontSize: 6.7, lineHeight: '13px'}}>
      {label}
    </div>
  </div>;
})

const SmallItem = (({ item, onSelectItem }) => {
  const isMember = item.category === settings.global.membership;
  return <img style={{
    cursor: 'pointer',
    width: smallItemWidth,
    height: smallItemHeight,
    border: `1px solid ${isMember ? 'white' : 'grey'}`,
    borderRadius: 2,
    padding: 1,
    visibility: item.isVisible ? 'visible' : 'hidden'
  }}
              data-href={item.id}
              loading="lazy"
              src={item.href}
              onClick={() => onSelectItem(item.id)}
              alt={item.name}
  />

})

export default props => {
  const { isLarge, isVisible, category, oss, hasRepo } = props.item
  const isMember = category === settings.global.membership;
  const ossColorClass = isMember || oss ? 'oss' : 'nonoss';
  const colorClass = oss && !hasRepo ? 'norepo' : ossColorClass;

  const style = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gridColumnEnd: `span ${isLarge ? 2 : 1}`,
    gridRowEnd: `span ${isLarge ? 2 : 1}`
  }

  return <Fade timeout={1000} in={isVisible}>
    <div className={colorClass} style={style}>
      {isLarge ? <LargeItem {...props} isMember={isMember} /> : <SmallItem {...props} />}
    </div>
  </Fade>
}
