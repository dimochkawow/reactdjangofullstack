from django.conf import settings
from rest_framework import serializers
from core.user.models import User
from core.abstract.serializers import AbstractSerializer


class UserSerializer(AbstractSerializer):
    posts_count = serializers.SerializerMethodField()

    def get_posts_count(self, instance):
        return instance.post_set.all().count()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_active",
            "created",
            "updated",
            "bio",
            "avatar",
            "name",
            "posts_count",
        ]
        read_only_field = ["is_active"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if not representation.get("avatar", None):
            representation["avatar"] = settings.DEFAULT_AVATAR_URL
            return representation

        if settings.DEBUG:
            request = self.context.get("request")
            representation["avatar"] = request.build_absolute_uri(
                representation["avatar"]
            )

        return representation
