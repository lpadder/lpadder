/*
Edit footer to have less Docusaurus bloat
Switch to one row layout with copyright to the left and social icons to the right
*/
import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import { BsGithub } from 'react-icons/bs'
import { FaDiscord } from 'react-icons/fa'
import "./footer.css"

function Footer() {
  const {footer} = useThemeConfig();
  if (!footer) {
    return null;
  }
  const { copyright, style, links } = footer;
  
  const githubLink = links.filter(link => {
    return link.label === 'github'
  })[0]

  const discordLink = links.filter(link => {
    return link.label === 'discord'
  })[0]

  return (
    <div className={`footer footer--${style}`}>
      <span>{copyright}</span>
      <div id="icons">
        <a href={discordLink.to}>
          <FaDiscord className="faDiscord" />
        </a>
        <a href={githubLink.to}>
          <BsGithub className="bsGithub" />
        </a>
      </div>
    </div>
  );
}
export default React.memo(Footer);
