#!/bin/bash
# ============================================
#  එක command එකකින් website එක update කිරීම
#  භාවිතය: ./update.sh "මොනවද වෙනස් කළේ"
#  (නමක් නැතුවත් run කරන්න පුළුවන්)
# ============================================

cd "$(dirname "$0")"

echo "📦 Files එකතු කරමින්..."
git add .

MSG="${1:-Website update $(date +'%Y-%m-%d %H:%M')}"
git commit -m "$MSG"

echo "🚀 GitHub එකට push කරමින්..."
git push

echo ""
echo "✅ ඉවරයි! Vercel එක දැන් AUTO DEPLOY වෙනවා"
echo "⏱  විනාඩි 1-2කින් site එක update — https://your-site.vercel.app"
