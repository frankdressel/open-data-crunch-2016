import { test } from 'qunit';
import moduleForAcceptance from 'ddataninja/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | intro page');

test('visiting /intro-page', function(assert) {
  visit('/intro-page');

  andThen(function() {
    assert.equal(currentURL(), '/intro-page');
  });
});

test('should redirect to intro page', function (assert) {
  visit('/');
  andThen(function() {
      assert.equal(currentURL(), '/intro-page', 'should redirect automatically');
    });
});

test('should link to information about the company.', function (assert) {
  visit('/');
  click('a:contains("About")');
  andThen(function () {
      assert.equal(currentURL(), '/about', 'should navigate to about');
    });
});

test('should link to contact information', function (assert) {
  visit('/');
  click('a:contains("Contact")');
  andThen(function () {
      assert.equal(currentURL(), '/contact', 'should navigate to contact');
    });
});

test('should show qr and score image.', function (assert) {
  visit('/intro-page');
  andThen(function () {
      assert.equal(find('.qr-code img').length, 1, 'should show qr code');
      assert.equal(find('.score-image img').length, 1, 'should show score image');
    });
});
