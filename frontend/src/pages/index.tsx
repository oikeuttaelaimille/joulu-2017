import * as React from 'react'
import Img, { FluidObject } from 'gatsby-image'
import { graphql } from 'gatsby'

import Item, { Card } from '../components/Item'
import PaymentModal from '../components/PaymentModal'

const logo = require('../images/OE_H1_vari_RGB.svg')

import '../style/gatstrap.scss'
import IndexLayout from '../layouts'

type Image = {
  childImageSharp: {
    fluid?: FluidObject
  }
}

interface Props {
  data: {
    cards: {
      nodes: Card[]
    }
    naali: Image
    eero: Image
    ulla: Image
    hero: Image
  }
}

const IndexPage: React.FC<Props> = ({ data }) => {
  const [isModalOpen, setModalOpen] = React.useState(false)

  const selectCard: React.MouseEventHandler<HTMLButtonElement> = event => {
    setModalOpen(true)
  }

  return (
    <IndexLayout>
      <div>
        <div className="hero text-black mb-3">
          <div className="header justify-content-center d-flex flex-row">
            <a href="https://oikeuttaelaimille.fi">
              <img className="logo" src={logo} alt="Oikeutta eläimille -yhdistyksen logo" />
            </a>
          </div>
          <Img fluid={data.hero.childImageSharp.fluid} className="mb-4" />
          <h2 className="text-primary">Joululahja ystävällesi – ja eläimille ❤️</h2>

          <p className="font-weight-bold text-primary">
            Anna läheisellesi tänä jouluna tavaran sijaan kaunis aineeton lahja, joka ilahduttaa takuulla jokaisen eläinten ystävän mieltä –{' '}
            <i>ja vie samalla eteenpäin eläinten oikeuksia.</i>
          </p>
          <p>
            Oikeutta eläimille -järjestön aineettomat lahjat ovat eettinen hyvänmielen lahja, joilla kerrot läheisellesi, että olet
            muistanut hänen lisäkseen eläimiä tänä jouluna.
          </p>
          <p>
            Taitettavien korttien sisällä lukee ”Olen lahjoittanut puolestasi __ euroa Oikeutta eläimille -järjestön tekemään
            eläinoikeustyöhön.” Toinen sisäsivu on tyhjä, jotta voit kirjoittaa siihen omat terveisesi.
          </p>
          <p>
            Kaikki kerätyt varat käytetään järjestön kampanjointiin ja työhön. Kauniiden naaliaiheisten korttien taide on saatu
            lahjoituksena Ulla Thynelliltä ja Eero Lampiselta. Voit ostaa kortin haluamallesi summalle 10 €:sta ylöspäin. Postitamme kortin
            sinulle antamasi osoite- ja nimitietojen mukaan. Voit tilata kortin myös digitaalisena, toimitamme sen antamaasi
            sähköpostiosoitteeseen viipymättä.
          </p>
          <div className="justify-content-center d-flex flex-row">
            <button type="button" className="btn btn-primary btn-lg mt-4 mb-4" data-card-id="Naalikortti" onClick={selectCard}>
              Tilaa aineeton lahja!
            </button>
          </div>

          <Img fluid={data.ulla.childImageSharp.fluid} className="mb-4" />

          <p>
            Ulla Thynellin naalikortti on kuin suoraan talvisesta satumaailmasta. Voit käydä ihailemassa lisää Ullan taidetta täältä:{' '}
            <a href="https://ullathynell.com/">ullathynell.com</a>.
          </p>
          <p>
            Naalit ovatkin liki satuolennon kaltaisia Suomen luonnossa tänä päivänä, vaikka elävätkin niin kovin runsaslukuisina tarhoilla.
          </p>
          <p>
            Ostamalla Ullan kuvittaman kauniin naalikortin tuet työtämme, jonka yksi olennaisista visioista on tavata naaleja
            todennäköisemmin talvisessa satumetsässä kuin tarhalla. Yhdessä pystymme tekemään eläinten hyväksi enemmän.
          </p>
          <Img fluid={data.eero.childImageSharp.fluid} className="mb-4" />

          <p>
            Eero Lampisen naali on vapautunut kahleistaan, ja tästä on piikkilangan pätkä suussa muistona. Käy katsomassa Eero muita töitä
            täältä: <a href="http://www.eerolampinen.com/">eerolampinen.com</a>.
          </p>
          <p>
            Koska emme voi luottaa siihen, että kaikki naalit olisivat näin neuvokkaita, täytyy meidän yhdessä tehdä naalien hyväksi hiukan
            töitä.
          </p>
          <p>
            Ostamalla Eeron kuvittaman kortin tuet työtämme, jonka tavoite on tulevaisuus, jossa naaleja nähtäisiin useammin leikkivän
            luonnossa kuin häkkiin teljettynä. Yhdessä pystymme tekemään eläinten hyväksi enemmän.
          </p>
          <div className="bg-primary text-white p-4">
            <p>
              Pro tip! Tilaa kortti kotiisi, jos haluat kirjoittaa sen sisälle omat terveisesi lahjan saajalle! Kortin toinen sisäsivu on
              tyhjä. Jos tilaat kortin 18.12.2019 tai sen jälkeen, riippuu perille ehtiminen postista. Suosittelemme tilaamaan digitaalisen
              kortin jos haluat olla 100% varma, että kortti ehtii perille.
            </p>
          </div>
        </div>
        <Img fluid={data.naali.childImageSharp.fluid} className="mb-4" />
        <div className="justify-content-center d-flex flex-row">
          <button type="button" className="btn btn-primary btn-lg mb-4" data-card-id="Naalikortti" onClick={selectCard}>
            Tilaa aineeton lahja!
          </button>
        </div>
        <div className="text-center">
          <small className="text-muted">
            Rahankeräyslupa: Oikeutta eläimille -tukiyhdistys ry
            <br />
            Voimassa 1.1.2018 - 31.12.2019 koko Suomen alueella
            <br />
            Ahvenanmaata lukuun ottamatta.
            <br />
            Luvan numero on RA/2017/1352
            <br />
            <br />
            Lahjoitustili: FI26 5723 0220 4949 96
            <br />
          </small>
        </div>
      </div>

      {/*
      <Statistics />
      */}

      <PaymentModal
        isOpen={isModalOpen}
        toggle={() => {
          setModalOpen(!isModalOpen)
        }}
      />
    </IndexLayout>
  )
}

export default IndexPage

export const query = graphql`
  query IndexPageQuery {
    hero: file(relativePath: { eq: "joulukortti_eerolampinen_ullathynell_01.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    ulla: file(relativePath: { eq: "joulukorrti_ullathynell_01.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    eero: file(relativePath: { eq: "joulukorrti_eerolampinen_02.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
    naali: file(relativePath: { eq: "joulukortti_eerolampinen_ullathynell_02.jpg" }) {
      childImageSharp {
        fluid {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`
