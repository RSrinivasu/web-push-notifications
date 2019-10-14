import express from 'express'
const router = express.Router()
import webpush from 'web-push'
import mongoose from 'mongoose'
import keys from '../config/key' 
import q from 'q'

const Subscription = mongoose.model("subscribers")

router.post("/", (req,res)=>{
    console.log("push started")
    let payload={
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
        ttl: req.body.ttl,
        //icon: req.body.icon,
        //image: req.body.image,
        //badge: req.body.badge,
        tag: req.body.tag
    }
    Subscription.find({},(err, subcriptions)=>{
        console.log(keys)
        if(err){
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        }
        else{
            console.log(subcriptions)
            let parllelSubscriptionCalls = subcriptions.map((subscription)=>{
                return new Promise((resolve, rejects)=>{
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    };
                    console.info("pushSubscription", pushSubscription)
                    const pushOptions = {
                        vapidDetails: {
                            subject: "http://example.com",
                            privateKey: keys.PrivateKey,
                            publicKey: keys.PublicKey
                        },
                        TTL: payload.ttl,
                        headers: {}
                    };
                    console.info(pushOptions)
                    webpush.sendNotification(pushSubscription,JSON.stringify(payload),pushOptions).then((value) => {
                        resolve({
                            status: true,
                            endpoint: subscription.endpoint,
                            data: value
                        })
                    }).catch((err) => {
                            console.error("error in web push send notification",err)
                            rejects({
                                status: false,
                                endpoint: subscription.endpoint,
                                data: err
                            });
                        });
                    })
                })
            q.allSettled(parllelSubscriptionCalls).then((pushResults) => {
                console.info("result final :",pushResults);
            });
            res.json({
                data: 'Push triggered'
            })
        }
    })
})


module.exports = router;