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
    // 获取当前页面URL
    setShareUrl(window.location.href);

    // 点击外部区域时关闭QR码和提示框
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

  // 分享到微博
  const shareToWeibo = () => {
    const weiboUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(
      shareUrl
    )}&title=${encodeURIComponent(title)}&pic=&appkey=`;
    window.open(weiboUrl, "_blank");
    trackShare("weibo", title);
  };

  // 分享到Twitter
  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, "_blank");
    trackShare("twitter", title);
  };

  // 分享到Facebook
  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank");
    trackShare("facebook", title);
  };

  // 复制链接
  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      trackShare("copy_link", title);
    });
  };

  // 显示微信二维码
  const showWeChatQR = () => {
    setShowQR(true);
    trackShare("wechat_qr_shown", title);
  };

  return (
    <div className={styles.shareContainer}>
      <p className={styles.shareText}>分享到:</p>
      <div className={styles.shareButtons}>
        <button
          className={`${styles.shareButton} ${styles.wechat}`}
          onClick={showWeChatQR}
          aria-label="分享到微信"
        >
          <FaWeixin />
        </button>

        <button
          className={`${styles.shareButton} ${styles.weibo}`}
          onClick={shareToWeibo}
          aria-label="分享到微博"
        >
          <FaWeibo />
        </button>

        <button
          className={`${styles.shareButton} ${styles.twitter}`}
          onClick={shareToTwitter}
          aria-label="分享到Twitter"
        >
          <FaTwitter />
        </button>

        <button
          className={`${styles.shareButton} ${styles.facebook}`}
          onClick={shareToFacebook}
          aria-label="分享到Facebook"
        >
          <FaFacebook />
        </button>

        <button
          className={`${styles.shareButton} ${styles.copyLink}`}
          onClick={copyLink}
          aria-label="复制链接"
        >
          <FaLink />
          {showTooltip && (
            <div className={styles.tooltip} ref={tooltipRef}>
              链接已复制!
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
              aria-label="关闭二维码"
            >
              <FaTimes />
            </button>
            <h3>微信扫码分享</h3>
            <div className={styles.qrCode}>
              <QRCodeCanvas value={shareUrl} size={200} />
            </div>
            <p className={styles.qrInstructions}>
              请使用微信扫一扫功能扫描上方二维码
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButtons;
