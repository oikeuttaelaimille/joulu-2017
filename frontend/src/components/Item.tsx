import * as React from 'react';
import { graphql } from 'gatsby';
import Img, { FluidObject } from 'gatsby-image';

export interface Card {
  html: string
  frontmatter: {
    title: string
    alt: string
    button: string
    image: {
      childImageSharp: {
        fluid: FluidObject
      }
    }
  }
}

interface Props {
  card: Card

  onSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const Item: React.FC<Props> = ({ card: { frontmatter, html }, onSelect }) => (
  <div className="item mb-4 mx-auto">
    <div className="card item">
      <Img className="card-img-top" fluid={frontmatter.image.childImageSharp.fluid} alt={frontmatter.alt} />
      <div className="card-body d-flex flex-column">
        <div className="card-text mb-auto" dangerouslySetInnerHTML={{ __html: html }} />
        <div>
          <button className="btn btn-primary" onClick={onSelect}>{frontmatter.button}</button>
        </div>
      </div>
    </div>
  </div>
)

export default Item;

export const query = graphql`
  fragment CardData on MarkdownRemark {
    html
    frontmatter {
      title
      alt
      button
      image {
        childImageSharp {
          fluid(maxWidth: 800) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }

`