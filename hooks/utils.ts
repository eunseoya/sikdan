const onShare = async (elementId: string) => {
  try {
    const element = document.querySelector(`#${elementId}`);
    if (!element) return;

    const { default: html2canvas } = await import("html2canvas");

    const canvas = await html2canvas(element as HTMLElement);

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob as Blob);
      }, "image/png");
    });
    const clipboardData = [new ClipboardItem({ [blob.type]: blob })];
    await navigator.clipboard.write(clipboardData);

    // Check if Web Share API supports file sharing
    if (navigator.canShare({ title: "" })) {
      // Share the image
      await navigator.share({
        title: "Weekly Schedule",
      });
    } else {
      throw new Error("File sharing is not supported on this device");
    }
    console.log("Image shared successfully");
  } catch (error) {
    console.error("Error sharing Base64 image:", error);
  }
};

export { onShare };
