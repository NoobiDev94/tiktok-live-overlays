export class GiftsMonitor {
  processGift(data) {
      const { uniqueId, nickname, gift, giftName, giftPictureUrl } = data;
      const giftAmount = gift.repeat_count;
      const profilePicture = data.userDetails.profilePictureUrls[2];

      this.alertGifts(uniqueId, nickname, profilePicture, giftAmount, giftName, giftPictureUrl);
  }

  alertGifts(username, displayName, profilePicture, giftAmount, giftType, giftIcon) {
      // TODO: Implement logic to gift manipulation
  }
}