import { loadStripe } from "@stripe/stripe-js"

export async function checkout({ lineItems }) {
    let stripePromise = null;
    const getStripe = () => {
        if (!stripePromise) {
            stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        }
        return stripePromise;
    };
    const stripe = await getStripe();
    await stripe.redirectToCheckout({
        mode: "payment",
        lineItems,
        successUrl: `${window.location.origin}/request-360-feedback?session_id={CHECKOUT_SESSION_ID}&amount=5`,
        cancelUrl: `${window.location.origin}/request-360-feedback`
    });
}