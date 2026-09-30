import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertDeliveryAcknowledged, validBookingDates } from '../src/bookingDelivery.ts';
test('HTTP failures never acknowledge a booking, even with success in payload', () => {
  assert.throws(() => assertDeliveryAcknowledged(false, {success: true}));
});
test('HTTP success alone and negative/malformed acknowledgements are rejected', () => {
  for (const payload of [null, {}, {success:false}, {success:'false'}, {success:1}]) assert.throws(() => assertDeliveryAcknowledged(true,payload));
});
test('FormSubmit boolean and string acknowledgements are supported', () => {
  assert.doesNotThrow(() => assertDeliveryAcknowledged(true,{success:true}));
  assert.doesNotThrow(() => assertDeliveryAcknowledged(true,{success:'true'}));
});
test('same-day and reversed stays are rejected', () => {
  assert.equal(validBookingDates('2026-10-03','2026-10-03'),false);
  assert.equal(validBookingDates('2026-10-03','2026-10-02'),false);
  assert.equal(validBookingDates('2026-10-03','2026-10-04'),true);
});
