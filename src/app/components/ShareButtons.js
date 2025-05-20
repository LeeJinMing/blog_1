"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  FaWeixin,
  FaWeibo,
  FaTwitter,
  FaFacebook,
  FaLink,
  FaQrcode,
  FaTimes,
} from "react-icons/fa";
import styles from "./ShareButtons.module.css";
import { QRCodeCanvas } from "qrcode.react";
import { trackShare } from "@/lib/analytics";

const ShareButtons = ({ title, summary }) => {
  const [showQR, setShowQR] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const qrRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    // Get current page URL
    setShareUrl(window.location.href);

    // Close QR code and tooltip when clicking outside
    const handleClickOutside = (event) => {
      if (qrRef.current && !qrRef.current.contains(event.target)) {
        setShowQR(false);
      }
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Share to Weibo
  const shareToWeibo = () => {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(title)}&pic=&appkey=`;
    window.open(weiboUrl, "_blank");
    trackShare("weibo", title);
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
    trackShare("twitter", title);
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank");
    trackShare("facebook", title);
  };

  // Copy link
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      trackShare("copy_link", title);
    });
  };

  // Show WeChat QR code
  const showWeChatQR = () => {
    setShowQR(true);
    trackShare("wechat_qr_shown", title);
  };

  return (
    <div className={styles.shareContainer}>
      <p className={styles.shareText}>Share to:</p>
      <div className={styles.shareButtons}>
        <button
          className={`${styles.shareButton} ${styles.wechat}`}
          onClick={showWeChatQR}
          aria-label="Share to WeChat"
        >
          <FaWeixin />
        </button>

        <button
          className={`${styles.shareButton} ${styles.weibo}`}
          onClick={shareToWeibo}
          aria-label="Share to Weibo"
        >
          <FaWeibo />
        </button>

        <button
          className={`${styles.shareButton} ${styles.twitter}`}
          onClick={shareToTwitter}
          aria-label="Share to Twitter"
        >
          <FaTwitter />
        </button>

        <button
          className={`${styles.shareButton} ${styles.facebook}`}
          onClick={shareToFacebook}
          aria-label="Share to Facebook"
        >
          <FaFacebook />
        </button>

        <button
          className={`${styles.shareButton} ${styles.copyLink}`}
          onClick={copyLink}
          aria-label="Copy link"
        >
          <FaLink />
          {showTooltip && (
            <div className={styles.tooltip} ref={tooltipRef}>
              Link copied!
            </div>
          )}
        </button>
      </div>

      {showQR && (
        <div className={styles.qrCodeOverlay}>
          <div className={styles.qrCodeContainer} ref={qrRef}>
            <button
              className={styles.closeButton}
              onClick={() => setShowQR(false)}
              aria-label="Close QR code"
            >
              <FaTimes />
            </button>
            <h3>Scan WeChat QR Code to Share</h3>
            <div className={styles.qrCode}>
              <QRCodeCanvas value={shareUrl} size={200} />
            </div>
            <p className={styles.qrInstructions}>
              Please use WeChat's scan feature to scan the QR code above
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
