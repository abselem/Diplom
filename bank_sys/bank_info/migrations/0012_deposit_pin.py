# Generated by Django 4.1.7 on 2023-04-09 13:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bank_info', '0011_creditkinds_pict'),
    ]

    operations = [
        migrations.AddField(
            model_name='deposit',
            name='pin',
            field=models.CharField(default='0000', max_length=4),
        ),
    ]