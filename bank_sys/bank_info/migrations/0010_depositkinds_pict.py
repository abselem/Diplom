# Generated by Django 4.1.7 on 2023-04-07 08:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0009_cardkinds_paid'),
    ]

    operations = [
        migrations.AddField(
            model_name='depositkinds',
            name='pict',
            field=models.ImageField(null=True, upload_to='images/deposits/'),
        ),
    ]