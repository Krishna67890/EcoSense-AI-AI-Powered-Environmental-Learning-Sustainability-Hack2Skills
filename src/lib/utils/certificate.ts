import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateCertificate = async (userName: string, achievementDate: string, certificateId: string) => {
  const element = document.getElementById('certificate-template');
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // Higher scale for better print quality
      useCORS: true,
      backgroundColor: '#ffffff', // Use white background for the PDF itself
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`EcoSense-Certificate-${userName.replace(/\s+/g, '-')}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating certificate:', error);
    return false;
  }
};
