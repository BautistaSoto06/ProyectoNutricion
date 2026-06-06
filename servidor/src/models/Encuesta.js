export class Encuesta {
    constructor({
        id = null,
        name = null,
        age = null,
        gender,
        faculty,
        would_recommend,
        why_recommend,
        desc_odor,
        desc_aroma,
        desc_sweetness,
        desc_texture,
        intensity_banana,
        intensity_chocolate,
        intensity_garbanzo,
        intensity_carrot,
        comments = null,
        created_at = null
    }) {
        this.id = id;
        this.name = name;
        this.age = age ? Number(age) : null;
        this.gender = gender;
        this.faculty = faculty;
        this.wouldRecommend = would_recommend === 'si' || would_recommend === true;
        this.whyRecommend = why_recommend;
        
        this.descOdor = Number(desc_odor);
        this.descAroma = Number(desc_aroma);
        this.descSweetness = Number(desc_sweetness);
        this.descTexture = Number(desc_texture);
        this.intensityBanana = Number(intensity_banana);
        this.intensityChocolate = Number(intensity_chocolate);
        this.intensityGarbanzo = Number(intensity_garbanzo);
        this.intensityCarrot = Number(intensity_carrot);
        this.comments = comments;
        this.createdAt = created_at;
    }

    isValid() {
        const numerics = [
            this.descOdor, this.descAroma, this.descSweetness, this.descTexture,
            this.intensityBanana, this.intensityChocolate, this.intensityGarbanzo, this.intensityCarrot
        ];
        return numerics.every(v => !isNaN(v) && v >= 1 && v <= 10);
    }

    toDatabaseJson() {
        return {
            name: this.name,
            age: this.age,
            gender: this.gender,
            faculty: this.faculty,
            would_recommend: this.wouldRecommend,
            why_recommend: this.whyRecommend,
            comments: this.comments,
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
