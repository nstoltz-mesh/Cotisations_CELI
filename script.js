// Données des montants CELI par année
const celiData = {
    2009: 5000,
    2010: 5000,
    2011: 5000,
    2012: 5000,
    2013: 5500,
    2014: 5500,
    2015: 10000,
    2016: 5500,
    2017: 5500,
    2018: 5500,
    2019: 6000,
    2020: 6000,
    2021: 6000,
    2022: 6000,
    2023: 6500,
    2024: 7000,
    2025: 7000
};

// Éléments du DOM
const form = document.getElementById('celiForm');
const resultsSection = document.getElementById('results');
const totalAmountElement = document.getElementById('totalAmount');
const eligibleYearElement = document.getElementById('eligibleYear');
const tableBody = document.getElementById('tableBody');

// Écouteur d'événement pour le formulaire
form.addEventListener('submit', function(e) {
    e.preventDefault();
    calculateCeliRights();
});

// Fonction principale de calcul
function calculateCeliRights() {
    // Récupération des valeurs du formulaire
    const birthYear = parseInt(document.getElementById('birthYear').value);
    const currentYear = parseInt(document.getElementById('currentYear').value);

    // Validation des entrées
    if (!validateInputs(birthYear, currentYear)) {
        return;
    }

    // Calcul de l'année d'éligibilité (18 ans)
    const eligibleYear = birthYear + 18;

    // Vérification si la personne est éligible
    if (eligibleYear > currentYear) {
        showError(`Vous ne serez éligible au CELI qu'en ${eligibleYear} (à vos 18 ans).`);
        return;
    }

    // Calcul des droits de cotisation
    const rights = calculateRights(eligibleYear, currentYear);

    // Affichage des résultats
    displayResults(rights, eligibleYear);
}

// Fonction de validation des entrées
function validateInputs(birthYear, currentYear) {
    clearErrors();

    let isValid = true;

    if (!birthYear || birthYear < 1900 || birthYear > currentYear) {
        showError('Veuillez entrer une année de naissance valide.');
        isValid = false;
    }

    if (!currentYear || currentYear < 2009 || currentYear > 2030) {
        showError('L'année courante doit être entre 2009 et 2030.');
        isValid = false;
    }

    if (currentYear < birthYear) {
        showError('L'année courante ne peut pas être antérieure à l'année de naissance.');
        isValid = false;
    }

    return isValid;
}

// Fonction de calcul des droits
function calculateRights(eligibleYear, currentYear) {
    let totalRights = 0;
    const yearlyRights = [];

    // Déterminer l'année de début (pas avant 2009, année de création du CELI)
    const startYear = Math.max(eligibleYear, 2009);

    // Calculer pour chaque année
    for (let year = startYear; year <= currentYear; year++) {
        if (celiData[year]) {
            const amount = celiData[year];
            totalRights += amount;
            yearlyRights.push({ year, amount });
        }
    }

    return {
        total: totalRights,
        yearly: yearlyRights
    };
}

// Fonction d'affichage des résultats
function displayResults(rights, eligibleYear) {
    // Mise à jour du montant total
    totalAmountElement.textContent = formatCurrency(rights.total);
    eligibleYearElement.textContent = eligibleYear;

    // Création du tableau détaillé
    createDetailTable(rights.yearly);

    // Affichage de la section résultats avec animation
    resultsSection.style.display = 'block';
    resultsSection.classList.add('show');

    // Scroll vers les résultats
    resultsSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Fonction de création du tableau détaillé
function createDetailTable(yearlyRights) {
    tableBody.innerHTML = '';

    yearlyRights.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.year}</td>
            <td>${formatCurrency(item.amount)}</td>
        `;
        tableBody.appendChild(row);
    });

    // Ajout de la ligne total
    const totalRow = document.createElement('tr');
    totalRow.style.fontWeight = 'bold';
    totalRow.style.backgroundColor = '#f8f9fa';
    totalRow.innerHTML = `
        <td>Total</td>
        <td>${formatCurrency(yearlyRights.reduce((sum, item) => sum + item.amount, 0))}</td>
    `;
    tableBody.appendChild(totalRow);
}

// Fonction de formatage des montants
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Fonction d'affichage des erreurs
function showError(message) {
    clearErrors();

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;

    form.appendChild(errorDiv);

    // Cacher les résultats en cas d'erreur
    resultsSection.style.display = 'none';
}

// Fonction de nettoyage des erreurs
function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => error.remove());
}

// Initialisation avec l'année courante
document.addEventListener('DOMContentLoaded', function() {
    const currentYearInput = document.getElementById('currentYear');
    currentYearInput.value = new Date().getFullYear();
});