export class Encuesta {
    constructor({id = null, gender, faculty, would_recommend, why_recommend,desc_odor, desc_aroma, desc_sweetness, desc_texture,intensity_banana, intensity_chocolate, intensity_garbanzo, intensity_carrot,created_at = null})

    {
        this.id = id;
        this.gender = gender;
        this.faculty = faculty;
        this.role = role;
        this.wouldRecommend = !!would_recommend;
        this.whyRecommend = why_recommend;
        this.createdAt = created_at;
        
        // Calificaciones
        this.descOdor = Number(desc_odor);
        this.descAroma = Number(desc_aroma);
        this.descSweetness = Number(desc_sweetness);
        this.descTexture = Number(desc_texture);
        this.intensityBanana = Number(intensity_banana);
        this.intensityChocolate = Number(intensity_chocolate);
        this.intensityGarbanzo = Number(intensity_garbanzo);
        this.intensityCarrot = Number(intensity_carrot);
    }

    toDatabaseJson() {
        return {
            gender: this.gender,
            faculty: this.faculty,
            role: this.role,
            would_recommend: this.wouldRecommend,
            why_recommend: this.whyRecommend,
            desc_odor: this.descOdor,
            desc_aroma: this.descAroma,
            desc_sweetness: this.descSweetness,
            desc_texture: this.descTexture,
            intensity_banana: this.intensityBanana,
            intensity_chocolate: this.intensityChocolate,
            intensity_garbanzo: this.intensityGarbanzo,
            intensity_carrot: this.intensityCarrot
        };
    }
}