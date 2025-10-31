import apper from 'https://cdn.apper.io/actions/apper-actions.js';
import { jsPDF } from 'npm:jspdf';

apper.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, message: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { invoice } = await req.json();

    if (!invoice) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invoice data is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const doc = new jsPDF();
    
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241);
    doc.text('INVOICE', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(invoice.invoiceNumber || 'N/A', 20, 35);
    
    doc.setFontSize(10);
    doc.text('Bill To:', 20, 50);
    doc.setFont(undefined, 'bold');
    doc.text(invoice.client?.companyName || 'N/A', 20, 56);
    doc.setFont(undefined, 'normal');
    
    let yPos = 62;
    if (invoice.client?.contactPerson) {
      doc.text(invoice.client.contactPerson, 20, yPos);
      yPos += 6;
    }
    if (invoice.client?.email) {
      doc.text(invoice.client.email, 20, yPos);
      yPos += 6;
    }
    if (invoice.client?.phone) {
      doc.text(invoice.client.phone, 20, yPos);
      yPos += 6;
    }
    
    doc.text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 130, 50);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 130, 56);
    
    const statusColors = {
      draft: [156, 163, 175],
      sent: [59, 130, 246],
      paid: [34, 197, 94],
      overdue: [239, 68, 68]
    };
    const color = statusColors[invoice.status] || statusColors.draft;
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(130, 60, 40, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text(invoice.status.toUpperCase(), 135, 66);
    doc.setTextColor(0, 0, 0);
    
    yPos = Math.max(yPos, 80) + 10;
    
    doc.setFillColor(99, 102, 241);
    doc.rect(20, yPos, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Description', 22, yPos + 5);
    doc.text('Qty', 120, yPos + 5);
    doc.text('Price', 140, yPos + 5);
    doc.text('Amount', 170, yPos + 5);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    yPos += 12;
    
    invoice.items.forEach((item) => {
      const amount = (item.quantity * item.unitPrice).toFixed(2);
      
      doc.text(item.description, 22, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 140, yPos);
      doc.text(`$${amount}`, 170, yPos);
      yPos += 8;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    yPos += 10;
    doc.line(20, yPos, 190, yPos);
    yPos += 8;
    
    doc.text('Subtotal:', 140, yPos);
    doc.text(`$${invoice.subtotal.toFixed(2)}`, 170, yPos);
    yPos += 6;
    
    if (invoice.taxRate > 0) {
      doc.text(`Tax (${invoice.taxRate}%):`, 140, yPos);
      doc.text(`$${invoice.taxAmount.toFixed(2)}`, 170, yPos);
      yPos += 6;
    }
    
    if (invoice.discountAmount > 0) {
      doc.text('Discount:', 140, yPos);
      doc.text(`-$${invoice.discountAmount.toFixed(2)}`, 170, yPos);
      yPos += 6;
    }
    
    yPos += 2;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, yPos);
    doc.text(`$${invoice.total.toFixed(2)}`, 170, yPos);
    
    if (invoice.notes) {
      yPos += 15;
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.text('Notes:', 20, yPos);
      yPos += 6;
      doc.setFont(undefined, 'normal');
      const splitNotes = doc.splitTextToSize(invoice.notes, 170);
      doc.text(splitNotes, 20, yPos);
    }
    
    const pdfBase64 = doc.output('datauristring').split(',')[1];

    return new Response(
      JSON.stringify({ success: true, pdf: pdfBase64 }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: error.message || 'Failed to generate PDF'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});