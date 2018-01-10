export default function() {
  return [
    {
      img: require('../images/kortti1.jpg'),
      title: 'Kortti 1',
      body: 'Martta Meriläisen tussipiirroksessa eläimet kiittävät lahjan antajaa.',
      button: 'Valitse'
    },
    {
      img: require('../images/kortti2.jpg'),
      title: 'Kortti 2',
      body: 'Martta Meriläisen akvarellimaalauksessa kettuperhe viettää joulua.',
      button: 'Valitse'
    },
    {
      img: require('../images/lahjoitus.jpg'),
      title: 'Lahjoitus',
      isDonation: true,
      body: 'Haluan vain osallistua joulukeräykseen – en tarvitse tällä kertaa korttia.',
      button: 'Lahjoita'
    }
  ]
}
