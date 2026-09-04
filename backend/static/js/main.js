// Main JavaScript for Flask Job Portal

document.addEventListener('DOMContentLoaded', () => {
    
    // Role selection toggle on registration page
    const roleOptions = document.querySelectorAll('.role-option');
    const roleInput = document.getElementById('selected_role');
    const companyNameGroup = document.getElementById('company_name_group');

    if (roleOptions.length > 0 && roleInput) {
        roleOptions.forEach(option => {
            option.addEventListener('click', () => {
                roleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const selectedRole = option.dataset.role;
                roleInput.value = selectedRole;
                
                if (companyNameGroup) {
                    if (selectedRole === 'recruiter') {
                        companyNameGroup.style.display = 'block';
                    } else {
                        companyNameGroup.style.display = 'none';
                    }
                }
            });
        });
    }

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });

    // Custom File Input Preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const fileName = e.target.files[0]?.name;
            const label = input.nextElementSibling;
            if (fileName && label && label.classList.contains('file-custom-label')) {
                label.textContent = `Selected: ${fileName}`;
            }
        });
    });

    // Client-side quick search filter on jobs page
    const clientSearchInput = document.getElementById('client-job-search');
    const jobCards = document.querySelectorAll('.job-card');

    if (clientSearchInput && jobCards.length > 0) {
        clientSearchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().strip();
            jobCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(term)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Modal helper functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}
