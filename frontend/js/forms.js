/** Forms (Contact, Feedback, Report) */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('faq-container')) setupFaqAccordion();
    if (document.getElementById('feedback-form')) setupFeedbackForm();
    if (document.getElementById('report-problem-form')) setupReportProblemForm();
});

function setupFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('svg');
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
}

function setupFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('feedback-form-content').classList.add('hidden');
        document.getElementById('feedback-confirmation').classList.remove('hidden');
    });
}

function setupReportProblemForm() {
    const form = document.getElementById('report-problem-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('report-form-content').classList.add('hidden');
        document.getElementById('report-confirmation').classList.remove('hidden');
    });
}

