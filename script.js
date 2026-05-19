let favoris = [];
let panier = [];

function ouvrirPopup(titre, prix, image, description) {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('popup-titre').innerHTML = titre;
    document.getElementById('popup-prix').innerHTML = prix;
    document.getElementById('image-principale').src = image;
    document.getElementById('popup-desc').innerHTML = description;

    let btn = document.getElementById('btn-favoris');
    let isFav = false;
    for(let i = 0; i < favoris.length; i++) {
        if(favoris[i].titre === titre) {
            isFav = true;
            break;
        }
    }
    if(isFav) {
        btn.className = 'btn-fav actif-fav';
    } else {
        btn.className = 'btn-fav';
    }

    let produits = document.getElementsByClassName('element-produit');
    let minis = document.getElementsByClassName('mini-image');
    
    let indices = [];
    while(indices.length < 3 && indices.length < produits.length) {
        let rand = Math.floor(Math.random() * produits.length);
        if(indices.indexOf(rand) === -1) {
            indices.push(rand);
        }
    }
    
    for(let i = 0; i < indices.length; i++) {
        let prod = produits[indices[i]];
        let img = prod.getElementsByTagName('img')[0].src;
        let t = prod.getElementsByTagName('h3')[0].innerHTML;
        let d = prod.getElementsByTagName('p')[0].innerHTML;
        let p = prod.getElementsByTagName('p')[1].innerHTML;
        
        minis[i].src = img;
        minis[i].onclick = function() {
            ouvrirPopup(t, p, img, d);
        };
    }
}

function fermerPopup() {
    document.getElementById('popup').style.display = 'none';
}

function filtrer(categorie) {
    let produits = document.getElementsByClassName('element-produit');
    for(let i = 0; i < produits.length; i++) {
        if(categorie === 'Tout' || produits[i].className.indexOf(categorie) !== -1) {
            produits[i].style.display = 'block';
        } else {
            produits[i].style.display = 'none';
        }
    }
}

function filtrerBouton(bouton, categorie) {
    let boutons = document.getElementsByClassName('onglet');
    for(let i = 0; i < boutons.length; i++) {
        boutons[i].className = 'onglet';
    }
    bouton.className = 'onglet actif';
    filtrer(categorie);
}

function changerTaille(bouton) {
    let boutons = document.getElementsByClassName('bouton-taille');
    for(let i = 0; i < boutons.length; i++) {
        boutons[i].style.backgroundColor = 'white';
        boutons[i].style.color = 'black';
    }
    bouton.style.backgroundColor = 'black';
    bouton.style.color = 'white';
}

function toggleFavoris() {
    let btn = document.getElementById('btn-favoris');
    let titre = document.getElementById('popup-titre').innerHTML;
    let image = document.getElementById('image-principale').src;
    let prix = document.getElementById('popup-prix').innerHTML;

    if(btn.className.indexOf('actif-fav') !== -1) {
        btn.className = 'btn-fav';
        let nouveauxFavoris = [];
        for(let i = 0; i < favoris.length; i++) {
            if(favoris[i].titre !== titre) {
                nouveauxFavoris.push(favoris[i]);
            }
        }
        favoris = nouveauxFavoris;
    } else {
        btn.className = 'btn-fav actif-fav';
        favoris.push({titre: titre, image: image, prix: prix});
    }
}

function afficherFavoris() {
    document.getElementById('popup-favoris').style.display = 'block';
    let liste = document.getElementById('contenu-liste-favoris');
    liste.innerHTML = '';
    if(favoris.length === 0) {
        liste.innerHTML = '<p>Vous n\'avez pas encore de favoris.</p>';
        return;
    }
    for(let i=0; i<favoris.length; i++) {
        liste.innerHTML += "<div style='display:flex; align-items:center; gap:10px;'>" +
            "<img src='" + favoris[i].image + "' style='width:50px; height:50px; object-fit:cover; border-radius:5px;'>" +
            "<span style='font-weight:bold;'>" + favoris[i].titre + "</span>" +
            "<span>" + favoris[i].prix + "</span>" +
        "</div>";
    }
}

function toggleRecherche() {
    let container = document.getElementById('conteneur-recherche');
    let nav = document.getElementById('menu-nav');
    if(container.className.indexOf('etendu') !== -1) {
        container.className = 'conteneur-recherche';
        nav.className = '';
        document.getElementById('resultats-recherche').style.display = 'none';
    } else {
        container.className = 'conteneur-recherche etendu';
        nav.className = 'cache';
        document.getElementById('champ-recherche').focus();
    }
}

function chercherProduit() {
    let input = document.getElementById('champ-recherche').value.toLowerCase();
    let resultats = document.getElementById('resultats-recherche');
    resultats.innerHTML = '';
    
    if(input.length === 0) {
        resultats.style.display = 'none';
        return;
    }
    
    let produits = document.getElementsByClassName('element-produit');
    let matchCount = 0;
    for(let i = 0; i < produits.length; i++) {
        let titre = produits[i].getElementsByTagName('h3')[0].innerHTML;
        if(titre.toLowerCase().indexOf(input) !== -1) {
            let prix = produits[i].getElementsByTagName('p')[1].innerHTML;
            let img = produits[i].getElementsByTagName('img')[0].src;
            let desc = produits[i].getElementsByTagName('p')[0].innerHTML;
            
            let div = document.createElement('div');
            div.className = 'item-recherche';
            div.innerHTML = "<img src='" + img + "'> <span>" + titre + "</span>";
            div.onclick = function() {
                ouvrirPopup(titre, prix, img, desc);
                document.getElementById('champ-recherche').value = '';
                resultats.style.display = 'none';
                toggleRecherche();
            };
            resultats.appendChild(div);
            matchCount++;
        }
    }
    if(matchCount > 0) {
        resultats.style.display = 'block';
    } else {
        resultats.style.display = 'none';
    }
}

function ajouterPanier() {
    let titre = document.getElementById('popup-titre').innerHTML;
    let image = document.getElementById('image-principale').src;
    let prix = document.getElementById('popup-prix').innerHTML;
    panier.push({titre: titre, image: image, prix: prix});
    fermerPopup();
    afficherPanier();
}

function afficherPanier() {
    document.getElementById('popup-panier').style.display = 'block';
    let liste = document.getElementById('contenu-liste-panier');
    liste.innerHTML = '';
    if(panier.length === 0) {
        liste.innerHTML = '<p>Votre panier est vide.</p>';
        return;
    }
    for(let i=0; i<panier.length; i++) {
        liste.innerHTML += "<div style='display:flex; align-items:center; gap:10px;'>" +
            "<img src='" + panier[i].image + "' style='width:50px; height:50px; object-fit:cover; border-radius:5px;'>" +
            "<span style='font-weight:bold;'>" + panier[i].titre + "</span>" +
            "<span>" + panier[i].prix + "</span>" +
        "</div>";
    }
}

window.onload = function() {
    setTimeout(function() {
        let cookiePopup = document.getElementById('popup-cookies');
        if (cookiePopup) {
            cookiePopup.className = 'banniere-cookies visible';
        }
    }, 1000);
};

function accepterCookies() {
    if(document.getElementById('check-accepter').checked) {
        document.getElementById('popup-cookies').className = 'banniere-cookies';
    }
}

function refuserCookies() {
    if(document.getElementById('check-refuser').checked) {
        document.getElementById('popup-cookies').className = 'banniere-cookies';
        document.body.className = 'flou';
    }
}

function ouvrirPopupInspi(titre, image, description) {
    document.getElementById('popup-inspi').style.display = 'block';
    document.getElementById('inspi-img').src = image;
    document.getElementById('inspi-titre').innerHTML = titre;
    document.getElementById('inspi-desc').innerHTML = description;
}

function afficherCompte() {
    document.getElementById('popup-compte').style.display = 'block';
}

function creerCompte(event) {
    event.preventDefault();
    alert('Compte créé avec succès !');
    document.getElementById('popup-compte').style.display = 'none';
}
