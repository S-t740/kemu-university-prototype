/**
 * Email notification utility (stub for prototype)
 * In production, integrate with SendGrid, AWS SES, or similar
 */

export const sendInquiryNotification = async (inquiry) => {
  // Stub implementation - just log for now
  console.log('📧 New Inquiry Notification:');
  console.log(`   From: ${inquiry.name} (${inquiry.email})`);
  console.log(`   Source: ${inquiry.source}`);
  console.log(`   Message: ${inquiry.message.substring(0, 100)}...`);
  console.log(`   Time: ${inquiry.createdAt}`);
  
  // In production, send actual email:
  // await sendEmail({
  //   to: 'admin@kemu.ac.ke',
  //   subject: `New ${inquiry.source} inquiry from ${inquiry.name}`,
  //   html: `...`
  // });
  
  return true;
};

export default { sendInquiryNotification };


