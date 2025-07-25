// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('effectiveDate').valueAsDate = new Date();
    
    const formElements = document.querySelectorAll('input, select, textarea');
    formElements.forEach(element => {
        element.addEventListener('change', generateNDA);
        element.addEventListener('input', debounce(generateNDA, 500));
    });
    
    // Generate initial NDA
    generateNDA();
});

function generateNDA() {
    const loading = document.getElementById('loading');
    const content = document.getElementById('ndaContent');
    
    loading.style.display = 'block';
    content.style.display = 'none';
    
    setTimeout(() => {
        const ndaData = collectFormData();
        const ndaHTML = generateNDAContent(ndaData);
        
        content.innerHTML = ndaHTML;
        content.style.display = 'block';
        loading.style.display = 'none';
    }, 1000);
}

function collectFormData() {
    return {
        type: document.getElementById('ndaType').value,
        party1Name: document.getElementById('party1Name').value || 'Party 1',
        party1Address: document.getElementById('party1Address').value || '[Party 1 Address]',
        party2Name: document.getElementById('party2Name').value || 'Party 2',
        party2Address: document.getElementById('party2Address').value || '[Party 2 Address]',
        effectiveDate: document.getElementById('effectiveDate').value || new Date().toISOString().split('T')[0],
        duration: document.getElementById('duration').value,
        purpose: document.getElementById('purpose').value || '[Purpose of disclosure]',
        governingLaw: document.getElementById('governingLaw').value || '[Governing Law]',
        nonSolicitation: document.getElementById('nonSolicitation').checked,
        returnClause: document.getElementById('returnClause').checked,
        injunctiveRelief: document.getElementById('injunctiveRelief').checked
    };
}

function generateNDAContent(data) {
    const formattedDate = new Date(data.effectiveDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    let durationText = data.duration === 'indefinite' ? 'indefinitely' : `for a period of ${data.duration} year${data.duration !== '1' ? 's' : ''}`;

    const ndaTitle = data.type === 'mutual' ? 'MUTUAL NON-DISCLOSURE AGREEMENT' : 'NON-DISCLOSURE AGREEMENT';

    return `
        <h2 style="text-align: center; margin-bottom: 30px;">${ndaTitle}</h2>
        
        <p>This Non-Disclosure Agreement ("Agreement") is entered into on <span class="highlight">${formattedDate}</span> by and between:</p>
        
        <p><strong>Disclosing Party:</strong><br>
        <span class="highlight">${data.party1Name}</span><br>
        ${data.party1Address.replace(/\n/g, '<br>')}</p>
        
        <p><strong>Receiving Party:</strong><br>
        <span class="highlight">${data.party2Name}</span><br>
        ${data.party2Address.replace(/\n/g, '<br>')}</p>

        <h3>1. PURPOSE</h3>
        <p>The parties wish to explore <span class="highlight">${data.purpose}</span> and in connection with this opportunity, it may be necessary for the parties to disclose certain confidential and proprietary information.</p>

        <h3>2. DEFINITION OF CONFIDENTIAL INFORMATION</h3>
        <p>For purposes of this Agreement, "Confidential Information" means any and all information or data, in any form or medium, that is disclosed by the Disclosing Party to the Receiving Party, including but not limited to:</p>
        <p>(a) Technical information, research, inventions, processes, algorithms, software, developments, formulations, compositions, know-how, and trade secrets;</p>
        <p>(b) Business information, including customer lists, supplier information, marketing strategies, financial information, business plans, and competitive analyses;</p>
        <p>(c) Any other information that is marked, designated, or otherwise identified as confidential or proprietary, or that would reasonably be considered confidential under the circumstances.</p>

        <h3>3. OBLIGATIONS OF RECEIVING PARTY</h3>
        <p>The Receiving Party agrees to:</p>
        <p>(a) Hold all Confidential Information in strict confidence;</p>
        <p>(b) Not disclose Confidential Information to any third parties without prior written consent;</p>
        <p>(c) Use Confidential Information solely for the purpose described above;</p>
        <p>(d) Take reasonable precautions to protect the confidentiality of the Confidential Information;</p>
        <p>(e) Limit access to Confidential Information to employees or agents who have a legitimate need to know and who have been informed of the confidential nature of such information.</p>

        <h3>4. EXCEPTIONS</h3>
        <p>The obligations set forth in Section 3 shall not apply to information that:</p>
        <p>(a) Is or becomes publicly available through no breach of this Agreement by the Receiving Party;</p>
        <p>(b) Was rightfully known by the Receiving Party prior to disclosure;</p>
        <p>(c) Is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation;</p>
        <p>(d) Is independently developed by the Receiving Party without use of or reference to Confidential Information;</p>
        <p>(e) Is required to be disclosed by law or court order, provided that the Receiving Party gives prompt notice to the Disclosing Party.</p>

        ${data.returnClause ? `
        <h3>5. RETURN OF MATERIALS</h3>
        <p>Upon termination of this Agreement or upon request by the Disclosing Party, the Receiving Party shall promptly return or destroy all documents, materials, and other tangible manifestations of Confidential Information and all copies thereof.</p>
        ` : ''}

        ${data.nonSolicitation ? `
        <h3>${data.returnClause ? '6' : '5'}. NON-SOLICITATION</h3>
        <p>During the term of this Agreement and for a period of one (1) year thereafter, the Receiving Party agrees not to directly or indirectly solicit, recruit, or hire any employees of the Disclosing Party without the prior written consent of the Disclosing Party.</p>
        ` : ''}

        <h3>${getNextSectionNumber(data)}. TERM</h3>
        <p>This Agreement shall remain in effect ${durationText} from the Effective Date, unless terminated earlier by mutual written consent of the parties.</p>

        ${data.injunctiveRelief ? `
        <h3>${getNextSectionNumber(data, 1)}. INJUNCTIVE RELIEF</h3>
        <p>The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party for which damages would be an inadequate remedy. Therefore, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law or in equity.</p>
        ` : ''}

        <h3>${getNextSectionNumber(data, data.injunctiveRelief ? 2 : 1)}. GOVERNING LAW</h3>
        <p>This Agreement shall be governed by and construed in accordance with the laws of <span class="highlight">${data.governingLaw}</span>.</p>

        <h3>${getNextSectionNumber(data, data.injunctiveRelief ? 3 : 2)}. ENTIRE AGREEMENT</h3>
        <p>This Agreement constitutes the entire understanding between the parties concerning the subject matter hereof and supersedes all prior agreements, understandings, discussions, and communications, whether written or oral.</p>

        <h3>${getNextSectionNumber(data, data.injunctiveRelief ? 4 : 3)}. AMENDMENT</h3>
        <p>This Agreement may be amended only by a written instrument signed by both parties.</p>

        <div class="signature-section">
            <h3>SIGNATURES</h3>
            <div class="signature-row">
                <div class="signature-block">
                    <p><strong>DISCLOSING PARTY</strong></p>
                    <br><br>
                    <p>_________________________</p>
                    <p>Signature</p>
                    <br>
                    <p>_________________________</p>
                    <p>Print Name</p>
                    <br>
                    <p>_________________________</p>
                    <p>Title</p>
                    <br>
                    <p>_________________________</p>
                    <p>Date</p>
                </div>
                <div class="signature-block">
                    <p><strong>RECEIVING PARTY</strong></p>
                    <br><br>
                    <p>_________________________</p>
                    <p>Signature</p>
                    <br>
                    <p>_________________________</p>
                    <p>Print Name</p>
                    <br>
                    <p>_________________________</p>
                    <p>Title</p>
                    <br>
                    <p>_________________________</p>
                    <p>Date</p>
                </div>
            </div>
        </div>
    `;
}

function getNextSectionNumber(data, offset = 0) {
    let section = 5;
    if (data.returnClause) section++;
    if (data.nonSolicitation) section++;
    return section + offset;
}

function downloadPDF() {
    const content = document.getElementById('ndaContent').innerHTML;
    if (!content.trim()) {
        alert('Please generate an NDA first before downloading.');
        return;
    }

    // Create a new window with the NDA content for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Non-Disclosure Agreement</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                h2 { color: #2c3e50; margin-top: 30px; }
                h3 { color: #34495e; margin-top: 25px; }
                .highlight { background: #fff3cd; padding: 2px 4px; }
                .signature-section { margin-top: 40px; page-break-inside: avoid; }
                .signature-row { display: flex; justify-content: space-between; }
                .signature-block { width: 45%; text-align: center; padding: 20px; border: 1px solid #ccc; }
                @media print { .signature-row { display: flex; } }
            </style>
        </head>
        <body>${content}</body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

function copyToClipboard() {
    const content = document.getElementById('ndaContent').innerText;
    if (!content.trim()) {
        alert('Please generate an NDA first before copying.');
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
        alert('NDA content copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('NDA content copied to clipboard!');
    });
}

function clearForm() {
    if (confirm('Are you sure you want to clear all form data?')) {
        document.querySelectorAll('input, select, textarea').forEach(element => {
            if (element.type === 'checkbox') {
                element.checked = element.id === 'returnClause' || element.id === 'injunctiveRelief';
            } else if (element.type === 'date') {
                element.valueAsDate = new Date();
            } else if (element.tagName === 'SELECT') {
                element.selectedIndex = element.id === 'duration' ? 2 : 0;
            } else {
                element.value = '';
            }
        });
        document.getElementById('ndaContent').innerHTML = '';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
