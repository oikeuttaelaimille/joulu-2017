const Utils = {

  analytics: {
    completePurchase: function(amount, transaction_id) {
      // Facebook
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          value: amount,
          currency: 'EUR',
          content_name: 'Donation',
        });
      }

      // Google
      if (window.gtag) {
        window.gtag('event', 'purchase', {
          'transaction_id': transaction_id,
          'value': amount,
          'currency': 'EUR',
        });
      }
    },

    initiateCheckout: function(amount) {
      // Facebook
      if (window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          value: amount,
          currency: 'EUR',
          content_name: 'Donation',
        });
      }

      // Google
      if (window.gtag) {
        window.gtag('event', 'begin_checkout', {
          'value': amount,
          'currency': 'EUR',
        });
      }
    }
  },

  scrollTo: function(element, to, duration) {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
      window.scrollTo(0,0);
    } else {
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;

      setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        Utils.scrollTo(element, to, duration - 10);
      }, 10);
    }
  }
}

export default Utils;
