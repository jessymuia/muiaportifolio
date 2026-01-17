// Price List Functionality - WITHOUT TOAST
document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        dateElement.textContent = currentDate;
    }
    
    // Print functionality
    const printBtn = document.getElementById('printPriceList');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
    
    // Download as PDF functionality
    const downloadBtn = document.getElementById('downloadPriceList');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            setTimeout(() => {
                generatePDF();
            }, 500);
        });
    }
    
    // Add price list section to navigation
    const priceListSection = document.getElementById('pricelist');
    if (priceListSection) {
        priceListSection.classList.add('section');
        priceListSection.classList.add('back-section');
    }
    
    // Add hover effects to price items
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Generate PDF function (without toast feedback)
function generatePDF() {
    const priceListContainer = document.querySelector('.price-list-container');
    if (!priceListContainer) return;
    
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ICT Services Price List - Christopher Jessy Muia</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                
                body {
                    font-family: 'Poppins', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    padding: 30px;
                    background: #f8f9fa;
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .header {
                    text-align: center;
                    border-bottom: 3px solid #ec1839;
                    padding-bottom: 25px;
                    margin-bottom: 35px;
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                }
                .header h1 {
                    color: #ec1839;
                    margin-bottom: 25px;
                    font-size: 36px;
                    font-weight: 700;
                }
                .contact-info {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 20px;
                    border-left: 4px solid #ec1839;
                }
                .contact-info p {
                    margin: 8px 0;
                    font-size: 15px;
                }
                .contact-info strong {
                    color: #ec1839;
                }
                .section {
                    margin-bottom: 40px;
                    page-break-inside: avoid;
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 3px 15px rgba(0,0,0,0.08);
                }
                .section h2 {
                    color: #ec1839;
                    border-bottom: 2px solid #ec1839;
                    padding-bottom: 12px;
                    margin-bottom: 20px;
                    font-size: 24px;
                    font-weight: 600;
                }
                .price-item {
                    background: #f8f9fa;
                    padding: 20px;
                    margin: 15px 0;
                    border-radius: 8px;
                    border-left: 4px solid #ec1839;
                }
                .price-item h3 {
                    color: #333;
                    margin-bottom: 12px;
                    font-size: 18px;
                    font-weight: 600;
                }
                .price {
                    color: #ec1839;
                    font-weight: bold;
                    margin: 10px 0;
                    font-size: 18px;
                }
                ul {
                    margin-left: 25px;
                    margin-top: 15px;
                }
                li {
                    margin: 8px 0;
                    padding-left: 5px;
                }
                li:before {
                    content: "•";
                    color: #ec1839;
                    font-weight: bold;
                    position: absolute;
                    left: -15px;
                }
                .footer {
                    text-align: center;
                    margin-top: 50px;
                    font-size: 14px;
                    color: #666;
                    padding-top: 25px;
                    border-top: 2px solid #ec1839;
                }
                .important-notes {
                    background: #fff3f5;
                    border: 2px solid #ec1839;
                    padding: 25px;
                }
                @media print {
                    body {
                        padding: 15px;
                        background: white;
                    }
                    .header {
                        box-shadow: none;
                        border: 2px solid #ec1839;
                    }
                    .section {
                        box-shadow: none;
                        border: 1px solid #ddd;
                    }
                    .no-print {
                        display: none;
                    }
                }
                .print-actions {
                    text-align: center;
                    margin: 30px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                .print-btn {
                    background: #ec1839;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    margin: 0 10px;
                }
                .download-btn {
                    background: #2196F3;
                }
                .brand {
                    color: #ec1839;
                    font-weight: 700;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .brand span {
                    color: #333;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="brand">
                    <span>J.</span>muia Portfolio
                </div>
                <h1>ICT SERVICES & PRICE LIST</h1>
                <div class="contact-info">
                    <p><strong>Christopher Jessy Muia</strong></p>
                    <p>Diploma in Information and Communication Technology (ICT)</p>
                    <p>Email: jessymuiaa@gmail.com</p>
                    <p>Phone: +254 710 318560</p>
                    <p>Date: ${currentDate}</p>
                    <p>Location: Nairobi, Kenya</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Introduction</h2>
                <p>I am a qualified ICT professional offering a wide range of ICT-related services including website development, system support, networking, payment system integration, and general IT services.</p>
            </div>
            
            <div class="section">
                <h2>Website Design & Development</h2>
                <div class="price-item">
                    <h3>Basic Website Package</h3>
                    <p class="price">KES 15,000 – 25,000 (One-time)</p>
                    <p><strong>Includes:</strong></p>
                    <ul>
                        <li>Up to 5 pages</li>
                        <li>Mobile-friendly design</li>
                        <li>Contact form</li>
                        <li>Basic SEO setup</li>
                        <li>Responsive layout</li>
                    </ul>
                </div>
                
                <div class="price-item">
                    <h3>Standard Website Package</h3>
                    <p class="price">KES 30,000 – 45,000 (One-time)</p>
                    <p><strong>Includes:</strong></p>
                    <ul>
                        <li>Up to 10 pages</li>
                        <li>Custom design</li>
                        <li>Google Maps & WhatsApp integration</li>
                        <li>Performance optimization</li>
                        <li>Social media integration</li>
                    </ul>
                </div>
                
                <div class="price-item">
                    <h3>Advanced Website Package</h3>
                    <p class="price">KES 50,000+ (One-time)</p>
                    <p><strong>Includes:</strong></p>
                    <ul>
                        <li>Unlimited pages</li>
                        <li>Advanced features</li>
                        <li>Security hardening</li>
                        <li>Client training</li>
                        <li>6 months support</li>
                    </ul>
                </div>
            </div>
            
            <div class="section">
                <h2>M-Pesa Payment Integration</h2>
                <div class="price-item">
                    <p>M-Pesa Daraja API integration (STK Push): <strong>KES 10,000 – 20,000</strong></p>
                    <p>Paybill / Till Number integration: <strong>KES 8,000 – 15,000</strong></p>
                    <p>Online payment confirmation & callbacks: <strong>KES 5,000 – 10,000</strong></p>
                    <p>Payment records dashboard setup: <strong>KES 5,000 – 12,000</strong></p>
                    <p>Testing, deployment & documentation: <strong>Included</strong></p>
                    <p style="margin-top: 15px; padding: 10px; background: #fff3f5; border-radius: 5px;">
                        <strong>Note:</strong> Client must provide approved Safaricom Daraja credentials.
                    </p>
                </div>
            </div>
            
            <div class="section">
                <h2>Monthly Website Management</h2>
                <div class="price-item">
                    <p>Basic Management: <strong>KES 3,000 – 5,000/month</strong></p>
                    <p style="margin-left: 20px; font-size: 14px; color: #666;">• Weekly backups<br>• Security updates<br>• Basic content updates</p>
                    
                    <p>Standard Management: <strong>KES 7,000 – 12,000/month</strong></p>
                    <p style="margin-left: 20px; font-size: 14px; color: #666;">• Daily backups<br>• Performance monitoring<br>• Regular content updates</p>
                    
                    <p>Full Management: <strong>KES 15,000+/month</strong></p>
                    <p style="margin-left: 20px; font-size: 14px; color: #666;">• 24/7 monitoring<br>• Advanced security<br>• Complete maintenance</p>
                </div>
            </div>
            
            <div class="section">
                <h2>Computer Repair & Maintenance</h2>
                <div class="price-item">
                    <p>OS installation & upgrades: <strong>KES 1,500 – 3,000</strong></p>
                    <p>Virus removal & security setup: <strong>KES 1,000 – 2,500</strong></p>
                    <p>Hardware troubleshooting: <strong>KES 1,000+</strong></p>
                    <p>Software installation: <strong>KES 500 – 2,000</strong></p>
                    <p>Data backup & recovery: <strong>KES 2,000 – 5,000</strong></p>
                </div>
            </div>
            
            <div class="section">
                <h2>Networking Services</h2>
                <div class="price-item">
                    <p>LAN/Wi-Fi setup (small office/home): <strong>KES 5,000 – 15,000</strong></p>
                    <p>Router configuration & troubleshooting: <strong>KES 2,000 – 5,000</strong></p>
                    <p>Internet setup: <strong>KES 2,000 – 4,000</strong></p>
                    <p>Network security setup: <strong>KES 3,000 – 8,000</strong></p>
                </div>
            </div>
            
            <div class="section">
                <h2>Training & ICT Support</h2>
                <div class="price-item">
                    <p>Basic computer training: <strong>KES 1,000 – 2,000 per session</strong></p>
                    <p>Website & payment system training: <strong>KES 3,000 – 6,000</strong></p>
                    <p>On-site ICT support: <strong>KES 3,000 – 6,000</strong></p>
                    <p>Remote support: <strong>KES 500 – 1,500</strong></p>
                </div>
            </div>
            
            <div class="section important-notes">
                <h2>Important Notes</h2>
                <ul>
                    <li>Prices may vary depending on project complexity</li>
                    <li>Hardware, hosting, domain charges are billed separately</li>
                    <li>All prices are in Kenya Shillings (KES)</li>
                    <li>50% deposit required before project commencement</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>Validity</h2>
                <p>This price list is valid for 30 days from the date of issue.</p>
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <p><strong>Date Issued:</strong> ${currentDate}</p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Christopher Jessy Muia - ICT Professional</strong></p>
                <p>+254 710 318560 | jessymuiaa@gmail.com</p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Christopher Jessy Muia</p>
            </div>
            
            <div class="print-actions no-print">
                <button onclick="window.print()" class="print-btn">
                    Print This Price List
                </button>
                <button onclick="window.close()" class="print-btn download-btn">
                    Close Window
                </button>
            </div>
            
            <script>
                setTimeout(() => {
                    window.print();
                }, 1000);
            </script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Initialize price list navigation
function initializePriceListNavigation() {
    const priceListSection = document.getElementById('pricelist');
    const allSections = document.querySelectorAll('.section');
    
    if (priceListSection) {
        priceListSection.classList.add('section');
        priceListSection.classList.add('back-section');
        
        const priceListNav = document.querySelector('.nav li a[href="#pricelist"]');
        if (priceListNav) {
            priceListNav.addEventListener('click', function(e) {
                e.preventDefault();
                
                document.querySelectorAll('.nav li a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                
                this.classList.add('active');
                
                allSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                priceListSection.classList.add('active');
                
                if (window.innerWidth < 1200) {
                    const aside = document.querySelector('.aside');
                    const navToggler = document.querySelector('.nav-toggler');
                    if (aside && navToggler) {
                        aside.classList.remove('open');
                        navToggler.classList.remove('open');
                        allSections.forEach(section => {
                            section.classList.remove('open');
                        });
                    }
                }
            });
        }
    }
}

initializePriceListNavigation();