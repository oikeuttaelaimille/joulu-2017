import * as React from 'react'
import { css } from '@emotion/core'
import Img, { FluidObject } from 'gatsby-image'
import { graphql } from 'gatsby'

import Item, { Card } from '../components/Item'
import PaymentModal from '../components/PaymentModal'

const logo = require('../images/logo.svg');

import '../style/gatstrap.scss'
import IndexLayout from '../layouts';

interface Props {
  data: {
    cards: {
      nodes: Card[]
    }
    file: {
      childImageSharp: {
        fluid?: FluidObject
      }
    }
  }
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setModalOpen] = React.useState(false)

  return (
    <IndexLayout>

      <div
        css={css`
          max-width: 500px;
          margin: 0 auto;
        `}
      >
        <div className="hero text-white mb-3">
          <div className="header text-white d-flex flex-row align-items-center">
            <img className="logo mr-auto" src={logo} alt="Oikeutta eläimille -yhdistyksen logo"/>
            <h2>anna lahja eläimille</h2>
          </div>

          <Img fluid={data.file.childImageSharp.fluid} />

          <p className="mt-3">
            Mitä antaa lahjaksi läheiselle jolla "on jo kaikkea"? <br/>
            Miten olisi lahja, joka tuo saajalleen hyvän mielen ja auttaa samalla eläimiä?
          </p>
          <p>
            Tilaa Oikeutta eläimille -järjestön kaunis naali kortti lahjaksi läheiselle. ❤️
          </p>
          <p>
            Kortin ostamalla voit lahjoittaa ystäväsi puolesta vapaasti valitsemasi summan Oikeutta eläimille -järjestön työn tukemiseen.
          </p>
          <p>
            Kortin sisälle voit kirjoittaa terveiset lahjan saajalle. 🦊 Oikeutta eläimille järjestö työskentelee tuotanto- ja turkiseläinten hyvinvoinnin ja oikeuksien edistämiseksi. Pyrimme muuttamaan eläinten asemaa ja kohtelua Suomessa ja maailmalla kampanjoinnin, tiedottamisen ja vaikuttamistyön avulla. Työmme pääpainoja 2019 ovat mm. Yritysvastuu -kampanjointi ja tarhauskiellon edistäminen Suomessa.(HUOM! Jos tilaat kortin valmistujaislahjaksi, otathan huomioon, että kortti tulee tilata viimeistään tiistaina 28.5.2019 jolloin sen pitäisi ehtiä postitse perille valmistujais viikonloppuun mennessä.
          </p>
        </div>

        {data.cards.nodes.map(card => (
          <Item key={card.frontmatter.title} card={card} onSelect={() => setModalOpen(true)} />
        ))}

        <div className="text-center">
          <small className="text-muted">
            Rahankeräyslupa: Oikeutta eläimille -tukiyhdistys ry<br/>
            Voimassa 1.1.2018 - 31.12.2019 koko Suomen alueella<br/>
            Ahvenanmaata lukuun ottamatta.<br/>
            Luvan numero on RA/2017/1352<br/>
            <br/>
            Lahjoitustili: FI26 5723 0220 4949 96<br/>
          </small>
        </div>
      </div>


      {/*
      <Statistics />
      */}


      <PaymentModal isOpen={isModalOpen} toggle={() => {setModalOpen(!isModalOpen)}} />
    </IndexLayout>
  );
}

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    cards: allMarkdownRemark {
      nodes {
        ...CardData
      }
    }
    file(relativePath: {eq: "naali_1.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
