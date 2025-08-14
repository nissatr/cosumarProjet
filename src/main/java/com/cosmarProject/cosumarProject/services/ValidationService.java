package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.StatutDemande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.model.Validation;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import com.cosmarProject.cosumarProject.repository.ValidationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ValidationService {

    private final DemandeRepository demandeRepository;
    private final ValidationRepository validationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public void validerDemande(Long demandeId, Long validateurId, String niveau, boolean accepte, String commentaire) {
        Demande demande = demandeRepository.findById(demandeId)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));
        Utilisateur validateur = utilisateurRepository.findById(validateurId)
                .orElseThrow(() -> new RuntimeException("Validateur non trouvé"));

        Validation validation = Validation.builder()
                .demande(demande)
                .validateur(validateur)
                .niveau(niveau)
                .statutValidation(accepte ? "ACCEPTEE" : "REFUSEE")
                .commentaire(commentaire)
                .dateValidation(LocalDateTime.now())
                .build();

        validationRepository.save(validation);

        // Si un niveau refuse, on passe la demande en REFUSEE immédiatement
        if (!accepte) {
            demande.setStatut(StatutDemande.REFUSEE);
            demande.setApprovedByManager(false);
            demandeRepository.save(demande);
            return;
        }

        // Si c'est un Manager N+1 qui approuve, marquer la demande comme approuvée par manager
        if ("Manager N+1".equals(niveau)) {
            demande.setApprovedByManager(true);
            demandeRepository.save(demande);
        }

        // La demande reste EN_COURS pour les niveaux intermédiaires (Manager N+1, Support IT, SI)
        // Elle ne devient ACCEPTEE qu'à la dernière étape: Administration
        if ("Administration".equals(niveau)) {
            demande.setStatut(StatutDemande.ACCEPTEE);
            demandeRepository.save(demande);
        }
    }

    /**
     * Récupérer toutes les validations (pour debug)
     */
    public List<Validation> getAllValidations() {
        return validationRepository.findAll();
    }
}

